<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Post;
use App\Models\DirectoryContact;
use Illuminate\Http\Request;

class PortalController extends Controller
{
    public function getServices()
    {
        return response()->json(Service::all());
    }

    public function getPosts()
    {
        return response()->json(Post::latest()->get());
    }

    public function getDirectory()
    {
        return response()->json(DirectoryContact::all());
    }
}
