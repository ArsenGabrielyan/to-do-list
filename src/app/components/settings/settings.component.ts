import { Component } from '@angular/core';
import { IColorBox } from '../../interfaces/color-box';

@Component({
  selector: 'toDo-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  styleDisplay = document.createElement("style");
  brightness = localStorage.getItem("brightness") || 100;
  colorbox: IColorBox[] = [
    {colorId: "red", color: "#dc3545"},
    {colorId: "blue", color: "#009EFF"},
    {colorId: "green", color: "#22b455"},
    {colorId: "yellow", color: "#FFBF00"},
    {colorId: "orange", color: "#FF6D28"},
    {colorId: "pink", color: "#F56EB3"},
    {colorId: "dark", color: "#2f2f2f"},
  ];
  ngOnInit():void{
    localStorage.setItem("brightness",String(100));
    document.getElementsByTagName("head")[0].appendChild(this.styleDisplay)
  }
  changeBgColor(id:string){
    const selectedItem = document.getElementById(id)!, 
    applied = `#btn:not(:disabled){border-color: ${selectedItem.innerHTML};color: ${selectedItem.innerHTML};} #btn.active, #btn:not(:disabled):hover{background-color: ${selectedItem.innerHTML} !important;color: white !important;} #range{background-color: ${selectedItem.innerHTML} !important;} .container input:checked ~ .checkbox{background-color: ${selectedItem.innerHTML} !important;border-color: ${selectedItem.innerHTML} !important;} #add-input:focus{border-color: ${selectedItem.innerHTML}} #icon:hover{color: ${selectedItem.innerHTML === "#2f2f2f" ? '#888' : selectedItem.innerHTML};}`;
    document.getElementById("app")!.style.backgroundColor = selectedItem.innerHTML;
    this.styleDisplay.appendChild(document.createTextNode(applied));
  }
  handleChangeBrightness(){
    localStorage.setItem('brightness',`${this.brightness}`);
    document.getElementById("app")!.style.filter = `brightness(${this.brightness}%)`
  }
}