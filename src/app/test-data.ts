import { InMemoryDbService } from 'angular-in-memory-web-api'; 



export class TestData implements InMemoryDbService { 
    createDb() { 
        let bookDetails = [ 
            { id: 1, title: 'Angular', author: 'Bob Loblaw' }, 
            { id: 2, title: 'ES6', author: 'Someone' }, 
            { id: 3, title: 'HTML5', author: 'Jane Doe' } 
        ]; 
        return { books: bookDetails }; 
    } 
} 
    