<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'subject' => ['required', 'string', 'min:3', 'max:180'],
            'message' => ['required', 'string', 'min:20', 'max:5000'],
        ]);

        ContactMessage::create($data);
        return response()->json(['message' => 'Votre message a bien été transmis à ENGINEERIUM.'], 201);
    }
}
