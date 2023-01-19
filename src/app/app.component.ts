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
  id: string = localStorage.getItem("tab") || "active";
  pending: ToDoItem[] = JSON.parse(localStorage.getItem("pending")!) || [];
  completed: ToDoItem[] = JSON.parse(localStorage.getItem("completed")!) || [];
  input = ""; destr = new Subject<void>();

  constructor(private rend: Renderer2){}
  ngOnDestroy(): void {this.destr.next()}
  
  tabChange(t:string){this.id = t;localStorage.setItem("tab", this.id)}
  addToDo(form: NgForm){
    let item: ToDoItem = {item: this.input,checked: false};this.pending.push(item);
    localStorage.setItem("pending", JSON.stringify(this.pending));form.reset(this.input)
  }
  handleCheckBox(e:any, i:number){
    if(e.target.checked === undefined) return;
    const parent = e.target.parentNode.parentElement;
    this.pending[i].checked = !this.pending[i].checked;
    this.completed.push(this.pending[i]);
    if(e.target.checked === this.pending[i].checked) this.removeItem(parent,i);
  }
  editToDo(i:number){
    const newVal = prompt('Enter a new Value'); 
    newVal?.trim() === "" ? alert("It's Required") : this.pending[i].item = newVal!;
    localStorage.setItem("pending", JSON.stringify(this.pending))
  }
  deleteToDo(i:number){
    const sure = confirm("Are you sure to delete this task (item)?")
    if(sure){this.completed.splice(i,1);localStorage.setItem("completed", JSON.stringify(this.completed))}
  }
  markAll(){
    if(!this.pending.length) {alert("There is No Active Tasks to Mark them all"); return;};
    this.pending.map((_,i)=>{
      this.pending[i].checked = true;this.completed.push(this.pending[i]);
      if(this.pending[i].checked) this.removeItem(document.querySelectorAll(".toDo")[i], i, this.pending.length);
    })
  }
  removeItem(parent: any, i:number, count: number = 1){
    this.rend.addClass(parent, "hide")
      timer(500).pipe(map(()=> {
        parent.remove();this.pending.splice(i,count)
        localStorage.setItem("pending", JSON.stringify(this.pending))
      }),takeUntil(this.destr)).subscribe();
    localStorage.setItem("completed", JSON.stringify(this.completed))
  }
  clearAll(){
    if(!this.completed.length) {alert("There is no Completed Tasks"); return};
    const sure = confirm("Are you sure to Clear all Completed Tasks?");
    this.completed.map(()=>{if(sure){this.completed.splice(0,this.completed.length);localStorage.setItem("completed", JSON.stringify(this.completed))}})
  }
}