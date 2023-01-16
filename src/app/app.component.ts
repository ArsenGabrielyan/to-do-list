import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToDoItem } from './interfaces/to-do-item';
import {timer, takeUntil, Subject, map} from "rxjs"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
  id: string = localStorage.getItem("activeId") || "active";
  activeToDos: ToDoItem[] = JSON.parse(localStorage.getItem("activeTasks")!) || [];
  completedToDos: ToDoItem[] = JSON.parse(localStorage.getItem("completedTasks")!) || [];
  input = ""; destroy$ = new Subject<void>();

  constructor(private renderer: Renderer2){}
  ngOnDestroy(): void {this.destroy$.next()}
  
  tabChange(id:string){this.id = id;localStorage.setItem("activeId", this.id)}
  addToDo(form: NgForm){
    let item: ToDoItem = {item: this.input,checked: false};this.activeToDos.push(item);
    localStorage.setItem("activeTasks", JSON.stringify(this.activeToDos))
    form.reset(this.input)
  }
  handleCheckBox(e:any, i:number){
    if(e.target.checked === undefined) return;
    const parentElem = e.target.parentNode.parentElement;
    this.activeToDos[i].checked = !this.activeToDos[i].checked;
    this.completedToDos.push(this.activeToDos[i]);
    if(e.target.checked === this.activeToDos[i].checked) this.removeItem(parentElem,i);
  }
  editToDo(i:number){
    const newVal = prompt('Enter a new Value'); 
    newVal?.trim() === "" ? alert("Enter value, not any blank spaces") : this.activeToDos[i].item = newVal!;
    localStorage.setItem("activeTasks", JSON.stringify(this.activeToDos))
  }
  deleteToDo(i:number){
    const sure = confirm("Are you sure you want to delete this task (item)?")
    if(sure){this.completedToDos.splice(i,1);localStorage.setItem("completedTasks", JSON.stringify(this.completedToDos))} else return;
  }
  markAll(){
    if(!this.activeToDos.length) {alert("There is No Active Tasks to Mark them all"); return;};
    this.activeToDos.map((_,i)=>{
      this.activeToDos[i].checked = true;this.completedToDos.push(this.activeToDos[i]);
      if(this.activeToDos[i].checked) this.removeItem(document.querySelectorAll(".toDo")[i], i, this.activeToDos.length);
    })
  }
  removeItem(parentElem: any, i:number, count: number = 1){
    this.renderer.addClass(parentElem, "hide")
      timer(500).pipe(map(()=> {
        parentElem.remove();
        this.activeToDos.splice(i,count)
        localStorage.setItem("activeTasks", JSON.stringify(this.activeToDos))
      }),takeUntil(this.destroy$)).subscribe();
    localStorage.setItem("completedTasks", JSON.stringify(this.completedToDos))
  }
  clearAll(){
    if(!this.completedToDos.length) {alert("There is no Completed Tasks"); return};
    const sure = confirm("Are you sure you want to Clear all Completed Tasks?");
    this.completedToDos.map(()=>{
      if(sure){
        this.completedToDos.splice(0,this.completedToDos.length);
        localStorage.setItem("completedTasks", JSON.stringify(this.completedToDos))
      } else return;
    })
  }
}