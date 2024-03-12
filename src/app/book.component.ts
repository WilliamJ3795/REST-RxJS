import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { BookService } from './book.service';
import { Book } from './book';

interface ibookForm { 
	id: FormControl<number>; 
	title: FormControl<string>; 
	author: FormControl<string>; 
	}



@Component({
	selector: 'app-book',
	templateUrl: './book.component.html',
	styleUrls: ['./book.component.css']
})


export class BookComponent implements OnInit {
	allBooks!: Book[]; 
	statusCode!: number; 
	requestProcessing = false; 
	bookIdToUpdate = -1; 
	processValidation = false;

	bookForm = new UntypedFormGroup({ 
		id: new UntypedFormControl(0), 
		title: new FormControl('', Validators.required), 
		author: new FormControl('', Validators.required) 
		});
		
		constructor(private bookService: BookService) { } 
		ngOnInit(): void { this.getAllBooks();}

		getAllBooks() { 
			this.bookService.getAllBooks().subscribe( 
			data => this.allBooks = data, 
			errorCode => this.statusCode = errorCode); 
			}
			onBookFormSubmit() { 
				this.processValidation = true; 
				if (this.bookForm.invalid) { 
				return; //Validation failed, exit from method. 
				} 
				//Form is valid, now perform create or update 
				this.preProcessConfigurations(); 
				let book = this.bookForm.value; 
				// Generate book id then create book 
				if (this.bookIdToUpdate === -1) { 
				this.bookService.getAllBooks().subscribe(books => { 
				// Generate book id 
				let maxIndex = books.length - 1; 
				let bookWithMaxIndex = books[maxIndex]; 
				let bookId = bookWithMaxIndex.id + 1; 
				book.id = bookId; 
				//Use the book service to create the book 
				this.bookService.createBook(book).subscribe(statusCode => { 
				//Check for success code 201 from server 
				this.statusCode = statusCode; 
				this.getAllBooks(); 
				this.backToCreateBook(); 
				}, 
				errorCode => this.statusCode = errorCode 
				); 
				}); 
				} else { 
				//Handle the book update method 
				book.id = this.bookIdToUpdate; 
				this.bookService.updateBook(book).subscribe(statusCode => { 
				//Expecting success code 204 from server 
				this.statusCode = 200; 
				this.getAllBooks(); 
				this.backToCreateBook(); 
				}, errorCode => this.statusCode = errorCode); 
				}}
				
				loadBookToEdit(bookId: string) { 
					this.preProcessConfigurations(); 
					this.bookService.getBookById(bookId).subscribe(book => { 
					this.bookIdToUpdate = book.id; 
					this.bookForm.setValue({id:book.id, title: book.title, 
					author: book.author }); 
					this.processValidation = true; 
					this.requestProcessing = false; 
					}, errorCode => this.statusCode = errorCode); 
				}
				deleteBook(bookId: string) { 
					this.preProcessConfigurations(); 
					this.bookService.deleteBookById(bookId).subscribe(successCode => { 
					//Expecting success code 204 from server 
					this.statusCode = 204; 
					this.getAllBooks(); 
					this.backToCreateBook(); 
					}, errorCode => this.statusCode = errorCode); 
					}
					preProcessConfigurations() { 
						this.statusCode = -1; 
						this.requestProcessing = true; 
						}
						backToCreateBook() { 
							this.bookIdToUpdate = -1; 
							this.bookForm.reset(); 
							this.processValidation = false; 
							}
}
