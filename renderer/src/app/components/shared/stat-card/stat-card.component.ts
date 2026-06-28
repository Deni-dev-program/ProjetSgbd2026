import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  icon  = input.required<string>();
  value = input.required<number | string>();
  label = input.required<string>();
  color = input<string>('#1565c0');
}
