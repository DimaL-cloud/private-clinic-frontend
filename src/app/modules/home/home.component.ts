import { Component } from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {PatientsComponent} from '../patients/patients.component';

@Component({
  selector: 'app-home',
  imports: [
    PatientsComponent
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
