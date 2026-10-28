<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Libraries\TestDataCleanup;

class ClearTestData extends BaseCommand
{
    protected $group = 'Database';
    protected $name = 'data:clear-test';
    protected $description = 'Clear operational data while keeping users and customer profiles.';
    protected $usage = 'data:clear-test [--confirm=CLEAR-TEST-DATA]';
    protected $options = [
        '--confirm' => 'Required to execute. Use the exact value CLEAR-TEST-DATA.',
    ];

    public function run(array $params)
    {
        $cleanup = new TestDataCleanup();
        $preview = $cleanup->preview();

        CLI::write('This command keeps all users and customer profiles.');
        CLI::write('It clears operational history and resets customer pending amounts, deposits, and outside jars.');
        CLI::newLine();
        foreach ($preview['counts'] as $table => $count) {
            CLI::write(sprintf('%s: %d rows', $table, $count));
        }
        foreach ($preview['skipped_tables'] as $table) {
            CLI::write(sprintf('%s: not present; skipped', $table));
        }
        CLI::write(sprintf(
            'customers: %d profiles will be kept and their balances reset',
            $preview['customer_count']
        ));

        if (CLI::getOption('confirm') !== 'CLEAR-TEST-DATA') {
            CLI::newLine();
            CLI::write('Dry run only. To execute after reviewing the counts, rerun with --confirm=CLEAR-TEST-DATA.');
            return EXIT_SUCCESS;
        }

        $cleanup->clear();

        CLI::newLine();
        CLI::write('Operational data cleared. Users and customer profiles were kept.', 'green');

        return EXIT_SUCCESS;
    }
}
