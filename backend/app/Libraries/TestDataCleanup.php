<?php

namespace App\Libraries;

use CodeIgniter\Database\BaseConnection;
use RuntimeException;
use Throwable;

class TestDataCleanup
{
    private const REQUIRED_TABLES = [
        'users',
        'customers',
        'deliveries',
        'payments',
        'expenses',
    ];

    private const TABLES_TO_CLEAR = [
        'payments',
        'party_return_history',
        'party_order_items',
        'deliveries',
        'party_orders',
        'expenses',
    ];

    private BaseConnection $db;

    public function __construct(?BaseConnection $db = null)
    {
        $this->db = $db ?? db_connect();
    }

    public function preview(): array
    {
        $missingRequired = array_filter(
            self::REQUIRED_TABLES,
            fn (string $table): bool => ! $this->db->tableExists($table)
        );

        if ($missingRequired !== []) {
            throw new RuntimeException('Required tables are missing: ' . implode(', ', $missingRequired));
        }

        $existingTables = array_values(array_filter(
            self::TABLES_TO_CLEAR,
            fn (string $table): bool => $this->db->tableExists($table)
        ));

        $counts = [];
        foreach ($existingTables as $table) {
            $counts[$table] = $this->db->table($table)->countAllResults();
        }

        return [
            'tables' => $existingTables,
            'skipped_tables' => array_values(array_diff(self::TABLES_TO_CLEAR, $existingTables)),
            'counts' => $counts,
            'customer_count' => $this->db->table('customers')->countAllResults(),
        ];
    }

    public function clear(): array
    {
        $preview = $this->preview();

        $this->db->transBegin();
        try {
            foreach ($preview['tables'] as $table) {
                $this->db->table($table)->where('1 = 1', null, false)->delete();
            }

            $this->db->table('customers')->update([
                'pending_amount' => 0,
                'security_deposit' => 0,
                'outside_jars' => 0,
            ]);

            if (! $this->db->transStatus()) {
                throw new RuntimeException('The database reported a failed cleanup operation.');
            }

            $this->db->transCommit();
        } catch (Throwable $error) {
            $this->db->transRollback();
            throw $error;
        }

        return $preview;
    }
}
