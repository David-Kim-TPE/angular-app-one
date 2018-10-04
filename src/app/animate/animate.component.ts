import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AnimateService } from './animate.service';

@Component({
  selector: 'app-animate',
  templateUrl: './animate.component.html',
  styleUrls: ['./animate.component.css']
})
export class AnimateComponent implements OnInit {
  @Input() msg: String;
  @Output() on: EventEmitter<any> = new EventEmitter();
  @Output() off: EventEmitter<any> = new EventEmitter();

  constructor(private animateService: AnimateService) { }

  ngOnInit() {

  }



}
