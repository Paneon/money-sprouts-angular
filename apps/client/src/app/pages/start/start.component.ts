import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'money-sprouts-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  buttonText: string;

  constructor(private router: Router) {
    this.buttonText = 'Go to LOGIN';
  }
}
