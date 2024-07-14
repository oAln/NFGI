import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title = 'NFGI';
  filteredStates: any = [];
  countries = ['USA', 'France', 'Algeria'];

  states = [
    {
      country: 'USA',
      stateList: ['New York', 'California', 'Washington'],
    },
    {
      country: 'France',
      stateList: ['Paris', 'Marseille', 'Monaco'],
    },
    {
      country: 'Algeria',
      stateList: ['Alger', 'Oran', 'Constantine'],
    },
  ];

  selectedCountry = '';
  selectedState = '';

  onCountrySelect(selectedCountry: any) {
    this.filteredStates = this.states.find(item => item.country === selectedCountry)?.stateList;
  }
}
