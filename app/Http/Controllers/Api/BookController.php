<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookController extends Controller
{
    // Get all available books
    public function index(Request $request)
    {
        $query = Book::with(['user'])->available();

        if ($request->has('category')) {
            $query->category($request->category);
        }

        if ($request->has('language')) {
            $query->language($request->language);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
            });
        }

        $books = $query->latest()->get();

        return response()->json($books);
    }

    // Get single book
    public function show($id)
    {
        $book = Book::with(['user', 'currentRequest.requester'])->findOrFail($id);
        return response()->json($book);
    }

    // Add new book
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'category' => 'required|in:novel,science,religious,history,children,cooking,self_development,other',
            'language' => 'required|in:arabic,english,french,other',
            'condition' => 'required|in:new,good,acceptable',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['status'] = 'available';

        $book = Book::create($validated);

        return response()->json([
            'message' => 'تم إضافة الكتاب بنجاح',
            'book' => $book
        ], 201);
    }

    // Update book
    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        if ($book->user_id !== Auth::id()) {
            return response()->json(['message' => 'غير مصرح'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'author' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|in:novel,science,religious,history,children,cooking,self_development,other',
            'language' => 'sometimes|in:arabic,english,french,other',
            'condition' => 'sometimes|in:new,good,acceptable',
        ]);

        $book->update($validated);

        return response()->json([
            'message' => 'تم تحديث الكتاب',
            'book' => $book
        ]);
    }

    // Delete book
    public function destroy($id)
    {
        $book = Book::findOrFail($id);

        if ($book->user_id !== Auth::id()) {
            return response()->json(['message' => 'غير مصرح'], 403);
        }

        $book->delete();

        return response()->json(['message' => 'تم حذف الكتاب']);
    }

    // Request to borrow
    public function requestBorrow(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        if ($book->user_id === Auth::id()) {
            return response()->json(['message' => 'لا يمكنك استعارة كتابك الخاص'], 400);
        }

        if ($book->status === 'borrowed') {
            return response()->json(['message' => 'الكتاب معار حالياً'], 400);
        }

        // Check if already requested
        $existing = BookRequest::where('book_id', $book->id)
            ->where('requester_id', Auth::id())
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return response()->json(['message' => 'لديك طلب قائم بالفعل'], 400);
        }

        $bookRequest = BookRequest::create([
            'book_id' => $book->id,
            'requester_id' => Auth::id(),
            'owner_id' => $book->user_id,
            'message' => $request->message,
            'status' => 'pending',
        ]);

        // TODO: Send notification to owner

        return response()->json([
            'message' => 'تم إرسال الطلب',
            'request' => $bookRequest
        ], 201);
    }

    // Get my books
    public function myBooks()
    {
        $books = Book::where('user_id', Auth::id())
            ->with(['currentRequest.requester'])
            ->latest()
            ->get();

        return response()->json($books);
    }

    // Get my borrow requests (books I want to borrow)
    public function myRequests()
    {
        $requests = BookRequest::where('requester_id', Auth::id())
            ->with(['book.user'])
            ->latest()
            ->get();

        return response()->json($requests);
    }

    // Get incoming requests (people wanting to borrow my books)
    public function incomingRequests()
    {
        $requests = BookRequest::where('owner_id', Auth::id())
            ->with(['book', 'requester'])
            ->latest()
            ->get();

        return response()->json($requests);
    }

    // Approve borrow request
    public function approveRequest($requestId)
    {
        $bookRequest = BookRequest::findOrFail($requestId);

        if ($bookRequest->owner_id !== Auth::id()) {
            return response()->json(['message' => 'غير مصرح'], 403);
        }

        $bookRequest->update([
            'status' => 'approved',
            'approved_at' => now()
        ]);

        // Update book status
        $bookRequest->book->update(['status' => 'borrowed']);

        // TODO: Send notification to requester

        return response()->json([
            'message' => 'تمت الموافقة على الطلب',
            'request' => $bookRequest
        ]);
    }

    // Reject borrow request
    public function rejectRequest($requestId)
    {
        $bookRequest = BookRequest::findOrFail($requestId);

        if ($bookRequest->owner_id !== Auth::id()) {
            return response()->json(['message' => 'غير مصرح'], 403);
        }

        $bookRequest->update(['status' => 'rejected']);

        return response()->json(['message' => 'تم رفض الطلب']);
    }

    // Mark as returned
    public function markReturned($requestId)
    {
        $bookRequest = BookRequest::findOrFail($requestId);

        if ($bookRequest->owner_id !== Auth::id()) {
            return response()->json(['message' => 'غير مصرح'], 403);
        }

        $bookRequest->update([
            'status' => 'returned',
            'returned_at' => now()
        ]);

        // Update book status
        $bookRequest->book->update(['status' => 'available']);

        return response()->json(['message' => 'تم تسجيل الإرجاع']);
    }
}
