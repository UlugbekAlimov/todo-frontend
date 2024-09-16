import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TodoService, Todo } from './service/todo.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  todoForm!: FormGroup;
  searchForm!: FormGroup;
  isEditing: boolean = false;
  currentTodoId: string | null = null;
  searchTitle: string = '';
  activeTodoId: string | null = null;
  
  @ViewChild('menuElement') menuElement!: ElementRef;

  constructor(private fb: FormBuilder, private todoService: TodoService) {}

  async ngOnInit(): Promise<void> {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });

    this.searchForm = this.fb.group({
      searchTitle: [''],
    });

    this.searchForm.get('searchTitle')?.valueChanges.subscribe(async (value) => {
      this.searchTitle = value; 
      await this.searchTodo();
    });

    await this.getTodos();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.menuElement && !this.menuElement.nativeElement.contains(event.target)) {
      this.activeTodoId = null;
    }
  }

  async getTodos(): Promise<void> {
    try {
      this.todos = await this.todoService.getTodos();
    } catch (err) {
      console.error('error:', err);
    }
  }

  async searchTodo(): Promise<void> {
    if (this.searchTitle && this.searchTitle.trim() !== '') {
      try {
        this.todos = await this.todoService.searchTodoByTitle(this.searchTitle);
      } catch (err) {
        console.error('error:', err);
      }
    } else {
      await this.getTodos(); 
    }
  }

  async addTodo(): Promise<void> {
    if (this.todoForm.valid) {
      const newTodo: Todo = { ...this.todoForm.value, completed: false };
      try {
        const createdTodo = await this.todoService.createTodo(newTodo);
        this.todos.push(createdTodo);
        this.todoForm.reset();
      } catch (err) {
        console.error('error:', err);
      }
    }
  }

  editTodo(todo: Todo): void {
    this.isEditing = true;
    this.currentTodoId = todo._id!;
    this.todoForm.patchValue({
      title: todo.title,
      description: todo.description,
    });
    this.activeTodoId = null; 
  }

  toggleMenu(id: string): void {
    this.activeTodoId = this.activeTodoId === id ? null : id;
  }

  async updateTodo(): Promise<void> {
    if (this.todoForm.valid && this.currentTodoId) {
      try {
        const updatedTodo = await this.todoService.updateTodo(
          this.currentTodoId,
          this.todoForm.value
        );
        const index = this.todos.findIndex(
          (todo) => todo._id === this.currentTodoId
        );
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
        this.cancelEdit();
      } catch (err) {
        console.error('error:', err);
      }
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.currentTodoId = null;
    this.todoForm.reset();
  }

  async deleteTodo(id: string): Promise<void> {
    try {
      await this.todoService.deleteTodo(id);
      this.todos = this.todos.filter((todo) => todo._id !== id);
    } catch (err) {
      console.error('error:', err);
    }
  }

  async clearSearch (): Promise<void> {
    this.searchForm.reset();
    this.searchTitle = '';
    await this.getTodos()
  }

  async toggleCompleted(id: string): Promise<void> {
    try {
      const updatedTodo = await this.todoService.markAsCompleted(id);
      const index = this.todos.findIndex((todo) => todo._id === id);
      if (index !== -1) {
        this.todos[index] = updatedTodo;
      }
    } catch (err) {
      console.error('error:', err);
    }
  }
}
