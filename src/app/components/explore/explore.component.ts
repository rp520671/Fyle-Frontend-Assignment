import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Workout {
  type: string;
  minutes: number;
}

interface UserData {
  id: number;
  name: string;
  workouts: Workout[];
}

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
})
export class ExploreComponent {
  filterForm = new FormGroup({
    name: new FormControl(''),
    type: new FormControl('All'),
  });

  userData: UserData[] | null = null;

  ngOnInit() {
    this.initializeData();
    this.userData = JSON.parse(localStorage.getItem('userData') || '[]');
  }

  initializeData() {
    const storedData = localStorage.getItem('userData');
    if (!storedData) {
      const initialData: UserData[] = [
    {
      id: 1,
      name: 'John Doe',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      workouts: [
        { type: 'Swimming', minutes: 60 },
        { type: 'Running', minutes: 20 }
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      workouts: [
        { type: 'Yoga', minutes: 50 },
        { type: 'Cycling', minutes: 40 }
      ]
    },
    ];
      localStorage.setItem('userData', JSON.stringify(initialData));
    }
  }

  getWorkoutTypes(workouts: Workout[]): string {
    return workouts.map((workout) => workout.type).join(', ');
  }

  getTotalMinutes(workouts: Workout[]): number {
    return workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  filteredUserData(): UserData[] {
    const formValue = this.filterForm.value;
    const userData = JSON.parse(localStorage.getItem('userData') || '[]');
    return userData.filter((user: UserData) => {
      if (formValue.name && !user.name.toLowerCase().includes(formValue.name.toLowerCase())) {
        return false;
      }
      if (formValue.type === 'All') {
        return true;
      }
      if (formValue.type) {
        const workouts = user.workouts.filter((workout) => workout.type === formValue.type);
        if (workouts.length === 0) {
          return false;
        }
      }
      return true;
    });
  }

  currentPage = 1;
  itemsPerPage = 5;
  pageChange(page: number) {
    this.currentPage = page;
  }

  prevPage() {
    this.currentPage--;
  }

  get totalPages() {
    return Math.ceil(this.filteredUserData().length / this.itemsPerPage);
  }

  nextPage() {
    this.currentPage++;
  }

  changeItemsPerPage(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
  }

  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUserData().slice(startIndex, startIndex + this.itemsPerPage);
  }
}
