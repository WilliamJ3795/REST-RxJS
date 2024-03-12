import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'; 
import { Observable, throwError } from 'rxjs'; 
import { map, catchError, tap } from 'rxjs/operators'; 
import { Book } from './book';


@Injectable({
    providedIn: 'root'
})
export class BookService {
    
    private handleError(error: any) { 
        console.error(error) ; 
        return throwError(error); 
        }
    //URL for CRUD operations
    bookUrl = "/api/books";
    //Create constructor to get Http instance
    constructor(private http: HttpClient) { }
    //Fetch all books
    getAllBooks(): Observable<Book[]> { 
        return this.http.get<Book[]>( 
        this.bookUrl).pipe( tap(books => 
        console.log("Number of books: " + books.length)), 
        catchError(this.handleError) 
        ); 
        }
    //Create book
    createBook(book: Book): Observable<number> { 
        let httpHeaders = 
        new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.post<Book>( this.bookUrl , book,{ 
            headers: httpHeaders, 
            observe: 'response'}).pipe( 
            map(res => res.status), 
            catchError(this.handleError) 
            ); 
        }
    
    //Fetch book by id
    getBookById(bookId: string): Observable<Book> { 
        return this.http.get<Book>(this.bookUrl + "/" + bookId).pipe( 
        tap(book => console.log(book.title + " " + book.author)), 
        catchError(this.handleError) 
        ); 
        }
    //Update book
    updateBook(book: Book): Observable<number> { 
        let httpHeaders = 
        new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.put<Book>( this.bookUrl + "/" + book.id, book, { 
            headers: httpHeaders, 
            observe: 'response'}).pipe( 
            map(res => res.status), 
            catchError(this.handleError) 
            ); 
            }
  
    //Delete book
    deleteBookById(bookId: string): Observable<number> { 
        return this.http.delete<number>(this.bookUrl + "/" + bookId).pipe( 
        tap(status => console.log("status: " + status)), 
        catchError(this.handleError) 
        ); 
    }
    
}