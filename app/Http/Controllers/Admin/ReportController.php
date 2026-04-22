<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;

class ReportController extends Controller
{
    // ══════════════════════════════════════════════════════
    // INDEX — Daftar semua event + statistik
    // ══════════════════════════════════════════════════════
    public function index()
    {
        $events = Event::withCount(['registrations', 'juryAssignments'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Reports/Index', [
            'events' => $events,
        ]);
    }

    // ══════════════════════════════════════════════════════
    // LEADERBOARD — Tampilkan di browser
    // ══════════════════════════════════════════════════════
    public function leaderboard(Event $event)
    {
        $criteria  = $event->criteria;
        $juryCount = $event->juryAssignments()->where('is_active', true)->count();

        $submissions = $this->buildLeaderboard($event, $criteria);

        return Inertia::render('Admin/Reports/Leaderboard', [
            'event'       => $event->load('categories'),
            'leaderboard' => $submissions,
            'criteria'    => $criteria,
            'jury_count'  => $juryCount,
        ]);
    }

    // ══════════════════════════════════════════════════════
    // EXPORT — Download Excel
    // ══════════════════════════════════════════════════════
    public function export(Event $event)
    {
        $criteria     = $event->criteria;
        $juryCount    = $event->juryAssignments()->where('is_active', true)->count();
        $leaderboard  = $this->buildLeaderboard($event, $criteria);

        // Load semua submission dengan scores detail untuk sheet 2
        $submissionsDetail = Submission::whereHas('registration', fn($q) =>
                $q->where('event_id', $event->id)->where('status', 'approved'))
            ->where('status', 'approved')
            ->with(['user', 'registration.category', 'scores.jury', 'scores.criteria'])
            ->get();

        $spreadsheet = new Spreadsheet();
        $spreadsheet->getProperties()
            ->setTitle("Leaderboard {$event->title}")
            ->setCreator('Kite Competition')
            ->setDescription("Laporan hasil lomba: {$event->title}");

        // ── Sheet 1: Leaderboard Utama ──
        $this->buildSheetLeaderboard(
            $spreadsheet->getActiveSheet(),
            $event, $criteria, $leaderboard, $juryCount
        );

        // ── Sheet 2: Detail Penilaian per Juri ──
        $sheet2 = $spreadsheet->createSheet();
        $sheet2->setTitle('Detail Penilaian');
        $this->buildSheetDetail($sheet2, $event, $criteria, $submissionsDetail);

        // ── Sheet 3: Rekap per Kategori ──
        $sheet3 = $spreadsheet->createSheet();
        $sheet3->setTitle('Rekap Kategori');
        $this->buildSheetKategori($sheet3, $event, $leaderboard);

        // ── Sheet 4: Kriteria Penilaian ──
        $sheet4 = $spreadsheet->createSheet();
        $sheet4->setTitle('Kriteria Penilaian');
        $this->buildSheetKriteria($sheet4, $criteria);

        // Set sheet aktif ke sheet pertama
        $spreadsheet->setActiveSheetIndex(0);

        // Stream ke browser
        $filename = 'leaderboard-' . $event->slug . '-' . now()->format('Ymd') . '.xlsx';

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $filename, [
            'Content-Type'        => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control'       => 'max-age=0',
        ]);
    }

    // ══════════════════════════════════════════════════════
    // HELPER: Hitung leaderboard (dipakai oleh leaderboard() dan export())
    // ══════════════════════════════════════════════════════
    private function buildLeaderboard(Event $event, $criteria): \Illuminate\Support\Collection
    {
        return Submission::whereHas('registration', fn($q) =>
                $q->where('event_id', $event->id)->where('status', 'approved'))
            ->where('status', 'approved')
            ->with(['user', 'registration.category', 'scores.criteria'])
            ->get()
            ->map(function ($submission) use ($criteria) {
                $totalWeighted = 0;
                $totalWeight   = 0;

                foreach ($criteria as $criterion) {
                    $criteriaScores = $submission->scores
                        ->where('criteria_id', $criterion->id);

                    if ($criteriaScores->isNotEmpty()) {
                        $avgScore       = $criteriaScores->avg('score');
                        $totalWeighted += $avgScore * $criterion->weight;
                        $totalWeight   += $criterion->weight;
                    }
                }

                $finalScore = $totalWeight > 0
                    ? round($totalWeighted / $totalWeight, 2)
                    : 0;

                // Skor per kriteria (rata-rata semua juri)
                $scorePerCriteria = [];
                foreach ($criteria as $criterion) {
                    $s = $submission->scores->where('criteria_id', $criterion->id);
                    $scorePerCriteria[$criterion->name] = $s->isNotEmpty()
                        ? round($s->avg('score'), 2)
                        : '-';
                }

                return [
                    'id'                => $submission->id,
                    'title'             => $submission->title,
                    'user'              => $submission->user,
                    'category'          => $submission->registration->category,
                    'final_score'       => $finalScore,
                    'scores_given'      => $submission->scores->count(),
                    'photo_url'         => $submission->photo_url,
                    'score_per_criteria'=> $scorePerCriteria,
                ];
            })
            ->sortByDesc('final_score')
            ->values();
    }

    // ══════════════════════════════════════════════════════
    // SHEET 1: Leaderboard Utama
    // ══════════════════════════════════════════════════════
    private function buildSheetLeaderboard($sheet, Event $event, $criteria, $leaderboard, int $juryCount): void
    {
        $sheet->setTitle('Leaderboard');

        // Hitung total kolom: Rank + Medal + Nama + Kategori + Judul + N kriteria + Skor Akhir
        $totalCols    = 5 + $criteria->count() + 1;
        $lastColLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($totalCols);

        // ── ROW 1: Judul ──
        $sheet->mergeCells("A1:{$lastColLetter}1");
        $sheet->setCellValue('A1', "🏆  LEADERBOARD — {$event->title}");
        $sheet->getRowDimension(1)->setRowHeight(40);
        $sheet->getStyle('A1')->applyFromArray([
            'font'      => ['bold' => true, 'size' => 15, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1E1B4B']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);

        // ── ROW 2: Subtitle ──
        $sheet->mergeCells("A2:{$lastColLetter}2");
        $sheet->setCellValue('A2', "Dicetak: " . now()->format('d F Y, H:i') . "  |  Total Peserta: " . $leaderboard->count() . "  |  Jumlah Juri: {$juryCount}");
        $sheet->getRowDimension(2)->setRowHeight(18);
        $sheet->getStyle('A2')->applyFromArray([
            'font'      => ['size' => 9, 'color' => ['rgb' => '94A3B8'], 'italic' => true, 'name' => 'Arial'],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0F172A']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);

        // ── ROW 3: Spacer ──
        $sheet->getRowDimension(3)->setRowHeight(6);

        // ── ROW 4-7: Info Event ──
        $infoData = [
            ['Nama Event',    $event->title],
            ['Tanggal Event', $event->event_start . ' s/d ' . $event->event_end],
            ['Lokasi',        $event->location ?? '-'],
            ['Status Event',  strtoupper($event->status)],
        ];

        foreach ($infoData as $i => $row) {
            $r = 4 + $i;
            $sheet->getRowDimension($r)->setRowHeight(18);
            $sheet->setCellValue("A{$r}", $row[0]);
            $sheet->mergeCells("B{$r}:D{$r}");
            $sheet->setCellValue("B{$r}", $row[1]);

            $sheet->getStyle("A{$r}")->applyFromArray([
                'font'      => ['bold' => true, 'size' => 9, 'color' => ['rgb' => '64748B'], 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F8FAFC']],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER, 'indent' => 1],
            ]);
            $sheet->getStyle("B{$r}")->applyFromArray([
                'font'      => ['bold' => true, 'size' => 9, 'color' => ['rgb' => '1E293B'], 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F8FAFC']],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER, 'indent' => 1],
            ]);
        }

        // ── ROW 8: Spacer ──
        $sheet->getRowDimension(8)->setRowHeight(6);

        // ── ROW 9: Header Tabel ──
        $headerRow = 9;
        $sheet->getRowDimension($headerRow)->setRowHeight(26);

        // Kolom tetap
        $fixedHeaders = ['Rank', 'Medal', 'Nama Peserta', 'Kategori', 'Judul Karya'];
        foreach ($fixedHeaders as $ci => $hdr) {
            $col = $ci + 1;
            $sheet->setCellValueByColumnAndRow($col, $headerRow, $hdr);
        }
        // Kolom kriteria dinamis
        foreach ($criteria as $ci => $criterion) {
            $col = 6 + $ci;
            $sheet->setCellValueByColumnAndRow($col, $headerRow, $criterion->name);
        }
        // Kolom skor akhir
        $sheet->setCellValueByColumnAndRow($totalCols, $headerRow, 'Skor Akhir');

        $sheet->getStyle("A{$headerRow}:{$lastColLetter}{$headerRow}")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 10, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '3730A3']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'borders'   => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '4338CA']]],
        ]);

        // ── DATA ROWS ──
        $medals   = ['🥇', '🥈', '🥉'];
        $goldBg   = 'FEF3C7';
        $silverBg = 'F1F5F9';
        $bronzeBg = 'FFF7ED';

        foreach ($leaderboard as $idx => $item) {
            $r      = $headerRow + 1 + $idx;
            $rank   = $idx + 1;
            $isTop3 = $rank <= 3;
            $rowBg  = $rank === 1 ? $goldBg : ($rank === 2 ? $silverBg : ($rank === 3 ? $bronzeBg : 'FFFFFF'));

            $sheet->getRowDimension($r)->setRowHeight(20);

            // Rank
            $sheet->setCellValueByColumnAndRow(1, $r, $rank);
            $rankColor = $rank === 1 ? 'D97706' : ($rank === 2 ? '6B7280' : ($rank === 3 ? 'B45309' : '1E293B'));
            $sheet->getStyleByColumnAndRow(1, $r)->applyFromArray([
                'font'      => ['bold' => true, 'size' => 11, 'color' => ['rgb' => $rankColor], 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $rowBg]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ]);

            // Medal
            $sheet->setCellValueByColumnAndRow(2, $r, $medals[$idx] ?? '');
            $sheet->getStyleByColumnAndRow(2, $r)->applyFromArray([
                'font'      => ['size' => 13, 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $rowBg]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ]);

            // Nama
            $sheet->setCellValueByColumnAndRow(3, $r, $item['user']->name);
            $sheet->getStyleByColumnAndRow(3, $r)->applyFromArray([
                'font'      => ['bold' => $isTop3, 'size' => 10, 'color' => ['rgb' => '1E293B'], 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $rowBg]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_LEFT, 'vertical' => Alignment::VERTICAL_CENTER, 'indent' => 1],
                'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ]);

            // Kategori
            $sheet->setCellValueByColumnAndRow(4, $r, $item['category']->name ?? '-');
            $sheet->getStyleByColumnAndRow(4, $r)->applyFromArray([
                'font'      => ['bold' => true, 'size' => 9, 'color' => ['rgb' => '3730A3'], 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $rowBg]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ]);

            // Judul Karya
            $sheet->setCellValueByColumnAndRow(5, $r, $item['title']);
            $sheet->getStyleByColumnAndRow(5, $r)->applyFromArray([
                'font'      => ['size' => 9, 'color' => ['rgb' => '1E293B'], 'italic' => true, 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $rowBg]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_LEFT, 'vertical' => Alignment::VERTICAL_CENTER, 'indent' => 1],
                'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ]);

            // Skor per kriteria
            foreach ($criteria as $ci => $criterion) {
                $col   = 6 + $ci;
                $score = $item['score_per_criteria'][$criterion->name] ?? '-';
                $sheet->setCellValueByColumnAndRow($col, $r, $score);
                $sheet->getStyleByColumnAndRow($col, $r)->applyFromArray([
                    'font'      => ['size' => 10, 'color' => ['rgb' => '1E293B'], 'name' => 'Arial'],
                    'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $rowBg]],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                    'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
                ]);
            }

            // Skor Akhir
            $scoreColor = $rank === 1 ? 'D97706' : ($rank === 2 ? '6B7280' : ($rank === 3 ? 'B45309' : '3730A3'));
            $sheet->setCellValueByColumnAndRow($totalCols, $r, $item['final_score']);
            $sheet->getStyleByColumnAndRow($totalCols, $r)->applyFromArray([
                'font'      => ['bold' => true, 'size' => 13, 'color' => ['rgb' => $scoreColor], 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $rowBg]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ]);
            $sheet->getStyleByColumnAndRow($totalCols, $r)
                  ->getNumberFormat()
                  ->setFormatCode('0.00');
        }

        // ── Baris rata-rata di akhir ──
        $lastDataRow = $headerRow + $leaderboard->count();
        $avgRow      = $lastDataRow + 1;
        $sheet->getRowDimension($avgRow)->setRowHeight(22);
        $sheet->mergeCells("A{$avgRow}:E{$avgRow}");
        $sheet->setCellValue("A{$avgRow}", 'Rata-rata Skor');
        $sheet->getStyle("A{$avgRow}")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 10, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '3730A3']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_RIGHT, 'vertical' => Alignment::VERTICAL_CENTER, 'indent' => 1],
        ]);

        foreach ($criteria as $ci => $criterion) {
            $col    = 6 + $ci;
            $colLtr = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col);
            $sheet->setCellValue("{$colLtr}{$avgRow}", "=AVERAGE({$colLtr}" . ($headerRow + 1) . ":{$colLtr}{$lastDataRow})");
            $sheet->getStyle("{$colLtr}{$avgRow}")->applyFromArray([
                'font'      => ['bold' => true, 'size' => 10, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '3730A3']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            ]);
            $sheet->getStyle("{$colLtr}{$avgRow}")->getNumberFormat()->setFormatCode('0.00');
        }

        $lastColAvg = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($totalCols);
        $sheet->setCellValue("{$lastColAvg}{$avgRow}", "=AVERAGE({$lastColAvg}" . ($headerRow + 1) . ":{$lastColAvg}{$lastDataRow})");
        $sheet->getStyle("{$lastColAvg}{$avgRow}")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 12, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '3730A3']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getStyle("{$lastColAvg}{$avgRow}")->getNumberFormat()->setFormatCode('0.00');

        // ── Lebar kolom ──
        $sheet->getColumnDimension('A')->setWidth(8);
        $sheet->getColumnDimension('B')->setWidth(9);
        $sheet->getColumnDimension('C')->setWidth(26);
        $sheet->getColumnDimension('D')->setWidth(20);
        $sheet->getColumnDimension('E')->setWidth(30);
        foreach ($criteria as $ci => $criterion) {
            $colLtr = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(6 + $ci);
            $sheet->getColumnDimension($colLtr)->setWidth(14);
        }
        $sheet->getColumnDimension($lastColLetter)->setWidth(13);

        // ── Freeze panes & print ──
        $sheet->freezePane("A{$headerRow}");
        $sheet->getPageSetup()
              ->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)
              ->setPaperSize(PageSetup::PAPERSIZE_A4)
              ->setFitToPage(true)
              ->setFitToWidth(1)
              ->setFitToHeight(0);
        $sheet->getHeaderFooter()
              ->setOddHeader("&C&B Leaderboard — {$event->title}");
        $sheet->getHeaderFooter()
              ->setOddFooter("&L Kite Competition &R Halaman &P dari &N");
    }

    // ══════════════════════════════════════════════════════
    // SHEET 2: Detail Penilaian per Juri
    // ══════════════════════════════════════════════════════
    private function buildSheetDetail($sheet, Event $event, $criteria, $submissions): void
    {
        // Ambil semua juri yang menilai event ini
        $juryIds = $event->juryAssignments()
            ->where('is_active', true)
            ->pluck('user_id');

        $juries = \App\Models\User::whereIn('id', $juryIds)->get();

        // Total kolom: No + Nama + Kategori + (N kriteria × M juri) + Rata2
        $juryCount  = $juries->count();
        $critCount  = $criteria->count();
        $totalCols  = 3 + ($critCount * $juryCount) + 1;
        $lastColLtr = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($totalCols);

        // Header utama
        $sheet->mergeCells("A1:{$lastColLtr}1");
        $sheet->setCellValue('A1', "DETAIL PENILAIAN PER JURI — {$event->title}");
        $sheet->getRowDimension(1)->setRowHeight(34);
        $sheet->getStyle('A1')->applyFromArray([
            'font'      => ['bold' => true, 'size' => 13, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0F172A']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);

        $sheet->getRowDimension(2)->setRowHeight(6);

        // Row 3: Header grup juri (merge per juri)
        $sheet->getRowDimension(3)->setRowHeight(24);
        $sheet->setCellValue('A3', 'No');
        $sheet->setCellValue('B3', 'Nama Peserta');
        $sheet->setCellValue('C3', 'Kategori');

        foreach ($juries as $ji => $jury) {
            $startCol   = 4 + ($ji * $critCount);
            $endCol     = $startCol + $critCount - 1;
            $startLtr   = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($startCol);
            $endLtr     = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($endCol);
            $sheet->mergeCells("{$startLtr}3:{$endLtr}3");
            $sheet->setCellValue("{$startLtr}3", "Juri: {$jury->name}");
            $sheet->getStyle("{$startLtr}3")->applyFromArray([
                'font'      => ['bold' => true, 'size' => 9, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '312E81']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            ]);
        }

        // Kolom Rata-rata
        $sheet->setCellValueByColumnAndRow($totalCols, 3, 'Rata-rata');

        // Styling header A3:C3
        $sheet->getStyle('A3:C3')->applyFromArray([
            'font'      => ['bold' => true, 'size' => 9, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '312E81']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getStyleByColumnAndRow($totalCols, 3)->applyFromArray([
            'font'      => ['bold' => true, 'size' => 9, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '312E81']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);

        // Row 4: Sub-header kriteria per juri
        $sheet->getRowDimension(4)->setRowHeight(28);
        $sheet->setCellValue('A4', '');
        $sheet->setCellValue('B4', '');
        $sheet->setCellValue('C4', '');

        foreach ($juries as $ji => $jury) {
            foreach ($criteria as $ci => $criterion) {
                $col    = 4 + ($ji * $critCount) + $ci;
                $colLtr = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col);
                $sheet->setCellValue("{$colLtr}4", $criterion->name);
                $sheet->getStyle("{$colLtr}4")->applyFromArray([
                    'font'      => ['bold' => true, 'size' => 8, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
                    'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4338CA']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
                    'borders'   => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '4F46E5']]],
                ]);
                $sheet->getColumnDimension($colLtr)->setWidth(13);
            }
        }

        $lastColLtr2 = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($totalCols);
        $sheet->getStyle("{$lastColLtr2}4")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 9, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4338CA']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);

        // ── DATA ──
        $medals = ['🥇', '🥈', '🥉'];
        $bgs    = ['FEF3C7', 'F1F5F9', 'FFF7ED'];

        // Sort berdasarkan skor (gunakan leaderboard order)
        $sorted = $submissions->sortByDesc(function ($sub) use ($criteria) {
            $tw = 0; $wt = 0;
            foreach ($criteria as $c) {
                $s = $sub->scores->where('criteria_id', $c->id);
                if ($s->isNotEmpty()) { $tw += $s->avg('score') * $c->weight; $wt += $c->weight; }
            }
            return $wt > 0 ? $tw / $wt : 0;
        })->values();

        foreach ($sorted as $idx => $submission) {
            $r      = 5 + $idx;
            $rank   = $idx + 1;
            $isTop3 = $rank <= 3;
            $bg     = $isTop3 ? $bgs[$rank - 1] : 'FFFFFF';

            $sheet->getRowDimension($r)->setRowHeight(20);

            // No
            $sheet->setCellValueByColumnAndRow(1, $r, $rank);
            $sheet->getStyleByColumnAndRow(1, $r)->applyFromArray([
                'font'      => ['bold' => true, 'size' => 10, 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $bg]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ]);

            // Nama
            $namaVal = ($medals[$idx] ?? '') . ' ' . $submission->user->name;
            $sheet->setCellValueByColumnAndRow(2, $r, $namaVal);
            $sheet->getStyleByColumnAndRow(2, $r)->applyFromArray([
                'font'      => ['bold' => $isTop3, 'size' => 9, 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $bg]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_LEFT, 'vertical' => Alignment::VERTICAL_CENTER, 'indent' => 1],
                'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ]);

            // Kategori
            $sheet->setCellValueByColumnAndRow(3, $r, $submission->registration->category->name ?? '-');
            $sheet->getStyleByColumnAndRow(3, $r)->applyFromArray([
                'font'      => ['size' => 8, 'color' => ['rgb' => '3730A3'], 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $bg]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ]);

            // Skor per juri per kriteria
            foreach ($juries as $ji => $jury) {
                foreach ($criteria as $ci => $criterion) {
                    $col   = 4 + ($ji * $critCount) + $ci;
                    $score = $submission->scores
                        ->where('jury_id', $jury->id)
                        ->where('criteria_id', $criterion->id)
                        ->first();
                    $val = $score ? $score->score : '-';
                    $sheet->setCellValueByColumnAndRow($col, $r, $val);
                    $sheet->getStyleByColumnAndRow($col, $r)->applyFromArray([
                        'font'      => ['size' => 10, 'name' => 'Arial'],
                        'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $bg]],
                        'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                        'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
                    ]);
                }
            }

            // Kolom rata-rata (formula Excel)
            $firstScoreCol = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(4);
            $lastScoreCol  = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(3 + $critCount * $juryCount);
            $avgCol        = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($totalCols);
            $sheet->setCellValue("{$avgCol}{$r}", "=IFERROR(AVERAGE({$firstScoreCol}{$r}:{$lastScoreCol}{$r}),\"-\")");
            $sheet->getStyle("{$avgCol}{$r}")->applyFromArray([
                'font'      => ['bold' => true, 'size' => 11, 'color' => ['rgb' => $rank == 1 ? 'D97706' : ($rank == 2 ? '6B7280' : ($rank == 3 ? 'B45309' : '3730A3'))], 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $bg]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ]);
            $sheet->getStyle("{$avgCol}{$r}")->getNumberFormat()->setFormatCode('0.00');
        }

        // Lebar kolom tetap
        $sheet->getColumnDimension('A')->setWidth(6);
        $sheet->getColumnDimension('B')->setWidth(24);
        $sheet->getColumnDimension('C')->setWidth(18);
        $sheet->getColumnDimension($lastColLtr2)->setWidth(13);

        $sheet->freezePane('A5');
        $sheet->getPageSetup()
              ->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)
              ->setPaperSize(PageSetup::PAPERSIZE_A4)
              ->setFitToPage(true)
              ->setFitToWidth(1);
    }

    // ══════════════════════════════════════════════════════
    // SHEET 3: Rekap per Kategori
    // ══════════════════════════════════════════════════════
    private function buildSheetKategori($sheet, Event $event, $leaderboard): void
    {
        $sheet->mergeCells('A1:G1');
        $sheet->setCellValue('A1', "REKAP PEMENANG PER KATEGORI — {$event->title}");
        $sheet->getRowDimension(1)->setRowHeight(34);
        $sheet->getStyle('A1')->applyFromArray([
            'font'      => ['bold' => true, 'size' => 13, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0F172A']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getRowDimension(2)->setRowHeight(6);

        // Kelompokkan per kategori
        $byKategori = $leaderboard->groupBy(fn($item) => $item['category']->name ?? 'Umum');

        $currentRow = 3;
        foreach ($byKategori as $kategoriName => $items) {
            // Header kategori
            $sheet->mergeCells("A{$currentRow}:G{$currentRow}");
            $sheet->setCellValue("A{$currentRow}", "  Kategori: {$kategoriName}");
            $sheet->getRowDimension($currentRow)->setRowHeight(24);
            $sheet->getStyle("A{$currentRow}")->applyFromArray([
                'font'      => ['bold' => true, 'size' => 11, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '3730A3']],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]);
            $currentRow++;

            // Sub-header
            $subHdrs = ['Rank', 'Medal', 'Nama Peserta', 'Judul Karya', 'Skor Akhir', 'Keterangan'];
            $subWidths = [8, 9, 26, 36, 12, 32];
            $sheet->getRowDimension($currentRow)->setRowHeight(22);
            foreach ($subHdrs as $ci => $h) {
                $sheet->setCellValueByColumnAndRow($ci + 1, $currentRow, $h);
                $sheet->getStyleByColumnAndRow($ci + 1, $currentRow)->applyFromArray([
                    'font'      => ['bold' => true, 'size' => 9, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
                    'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4338CA']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                ]);
                $sheet->getColumnDimension(
                    \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($ci + 1)
                )->setWidth($subWidths[$ci]);
            }
            $currentRow++;

            // Data per kategori (rank di dalam kategori)
            $medals    = ['🥇', '🥈', '🥉'];
            $bgs       = ['FEF3C7', 'F1F5F9', 'FFF7ED'];
            $keteranganMap = [
                1 => 'Juara 1 — Piala + Hadiah Utama',
                2 => 'Juara 2 — Piala + Hadiah Kedua',
                3 => 'Juara 3 — Piala + Hadiah Ketiga',
            ];

            foreach ($items->values() as $idx => $item) {
                $rank  = $idx + 1;
                $bg    = $bgs[$rank - 1] ?? 'FFFFFF';
                $medal = $medals[$rank - 1] ?? '';
                $ket   = $keteranganMap[$rank] ?? "Peringkat {$rank}";

                $sheet->getRowDimension($currentRow)->setRowHeight(20);
                $rowData = [$rank, $medal, $item['user']->name, $item['title'], $item['final_score'], $ket];

                foreach ($rowData as $ci => $val) {
                    $sheet->setCellValueByColumnAndRow($ci + 1, $currentRow, $val);
                    $isCenter = in_array($ci, [0, 1, 4]);
                    $colColor = $ci === 4
                        ? ($rank == 1 ? 'D97706' : ($rank == 2 ? '6B7280' : ($rank == 3 ? 'B45309' : '3730A3')))
                        : '1E293B';
                    $sheet->getStyleByColumnAndRow($ci + 1, $currentRow)->applyFromArray([
                        'font'      => ['bold' => ($rank <= 3 && $ci === 2) || $ci === 4, 'size' => $ci === 4 ? 12 : 9, 'color' => ['rgb' => $colColor], 'name' => 'Arial'],
                        'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $bg]],
                        'alignment' => ['horizontal' => $isCenter ? Alignment::HORIZONTAL_CENTER : Alignment::HORIZONTAL_LEFT, 'vertical' => Alignment::VERTICAL_CENTER, 'indent' => $isCenter ? 0 : 1],
                        'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
                    ]);
                    if ($ci === 4) {
                        $sheet->getStyleByColumnAndRow($ci + 1, $currentRow)
                              ->getNumberFormat()->setFormatCode('0.00');
                    }
                }
                $currentRow++;
            }
            $currentRow++; // Spacer antar kategori
        }

        $sheet->getPageSetup()
              ->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)
              ->setPaperSize(PageSetup::PAPERSIZE_A4);
    }

    // ══════════════════════════════════════════════════════
    // SHEET 4: Kriteria Penilaian
    // ══════════════════════════════════════════════════════
    private function buildSheetKriteria($sheet, $criteria): void
    {
        $sheet->mergeCells('A1:F1');
        $sheet->setCellValue('A1', 'KRITERIA PENILAIAN');
        $sheet->getRowDimension(1)->setRowHeight(34);
        $sheet->getStyle('A1')->applyFromArray([
            'font'      => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0F172A']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getRowDimension(2)->setRowHeight(6);

        // Header
        $hdrs   = ['No', 'Nama Kriteria', 'Deskripsi', 'Nilai Maks.', 'Bobot (×)', 'Keterangan'];
        $widths = [6, 26, 46, 14, 12, 28];
        $sheet->getRowDimension(3)->setRowHeight(24);
        foreach ($hdrs as $ci => $h) {
            $sheet->setCellValueByColumnAndRow($ci + 1, 3, $h);
            $sheet->getStyleByColumnAndRow($ci + 1, 3)->applyFromArray([
                'font'      => ['bold' => true, 'size' => 10, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '3730A3']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            ]);
            $sheet->getColumnDimension(
                \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($ci + 1)
            )->setWidth($widths[$ci]);
        }

        // Data
        foreach ($criteria as $idx => $criterion) {
            $r  = 4 + $idx;
            $bg = $idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
            $sheet->getRowDimension($r)->setRowHeight(22);

            $ket = "Bobot {$criterion->weight}× — Nilai maks. {$criterion->max_score}";
            $row = [$idx + 1, $criterion->name, $criterion->description ?? '-', $criterion->max_score, $criterion->weight, $ket];

            foreach ($row as $ci => $val) {
                $sheet->setCellValueByColumnAndRow($ci + 1, $r, $val);
                $isCenter = in_array($ci, [0, 3, 4]);
                $sheet->getStyleByColumnAndRow($ci + 1, $r)->applyFromArray([
                    'font'      => ['bold' => in_array($ci, [1, 4]), 'size' => 10, 'color' => ['rgb' => $ci === 4 ? '3730A3' : '1E293B'], 'name' => 'Arial'],
                    'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $bg]],
                    'alignment' => ['horizontal' => $isCenter ? Alignment::HORIZONTAL_CENTER : Alignment::HORIZONTAL_LEFT, 'vertical' => Alignment::VERTICAL_CENTER, 'indent' => $isCenter ? 0 : 1],
                    'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
                ]);
            }
        }

        // Baris total bobot
        $totalRow = 4 + $criteria->count();
        $sheet->getRowDimension($totalRow)->setRowHeight(22);
        $sheet->mergeCells("A{$totalRow}:D{$totalRow}");
        $sheet->setCellValue("A{$totalRow}", 'Total Bobot');
        $sheet->getStyle("A{$totalRow}")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 10, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '3730A3']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_RIGHT, 'vertical' => Alignment::VERTICAL_CENTER, 'indent' => 1],
        ]);
        $lastDataRow = $totalRow - 1;
        $sheet->setCellValue("E{$totalRow}", "=SUM(E4:E{$lastDataRow})");
        $sheet->getStyle("E{$totalRow}")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 12, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Arial'],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '3730A3']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getStyle("E{$totalRow}")->getNumberFormat()->setFormatCode('0.0');

        $sheet->getPageSetup()->setPaperSize(PageSetup::PAPERSIZE_A4);
    }
}