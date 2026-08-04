<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';

    protected $primaryKey = 'id';

    protected $returnType = 'array';

    protected $allowedFields = [
        'name',
        'mobile',
        'email',
        'password',
        'role',
        'status'
    ];

    protected $useTimestamps = true;
}