import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, retry } from 'rxjs';

export interface Todo {
  _id?: string;
  title: string;
  description?: string;
  completed: boolean
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/todo';

  constructor(private http: HttpClient) {}

  async getTodos(): Promise<Todo[]> {
    return firstValueFrom(this.http.get<Todo[]>(this.apiUrl));
  }

  async createTodo(todo: Todo): Promise<Todo> {
    return firstValueFrom(this.http.post<Todo>(this.apiUrl, todo));
  }

  async updateTodo(id: string, todo: Partial<Todo>): Promise<Todo> {
    return firstValueFrom(this.http.patch<Todo>(`${this.apiUrl}/${id}`, todo));
  }  

  async deleteTodo(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }

  async searchTodoByTitle(title : string):Promise<Todo[]>{
    const params = new HttpParams().set('title', title)
    return firstValueFrom(this.http.get<Todo[]>(`${this.apiUrl}/search`, {params} ))
  }

  async markAsCompleted(id: string): Promise<Todo> {
    return firstValueFrom(this.http.patch<Todo>(`${this.apiUrl}/${id}/complete`, null));
  }  
  
}

