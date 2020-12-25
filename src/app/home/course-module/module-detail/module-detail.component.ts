import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DataService} from '../../../_services/data.service';
import {AuthenticationService} from '../../../_services/authentication.service';
import {DAYS_OF_WEEK, DeleteModuleDialogComponent, LectureHour, ModuleData, Teacher} from '../course-module.component';
import {glow} from '../../../_services/shared.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-module-detail',
  templateUrl: './module-detail.component.html',
  styleUrls: ['./module-detail.component.css', '../course-module.component.css']
})
export class ModuleDetailComponent implements OnInit {

  progress = false;

  semesters = {};
  filteredSemesters = {};

  error = '';
  courseName = '';
  routeParameter;

  filter: FormControl = new FormControl('');

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    private data: DataService,
    private authentication: AuthenticationService,
    private elementRef: ElementRef
  ) {
    this.filter.valueChanges.subscribe(value => {
      const filterValue = value.toLowerCase();
      if (filterValue) {
        this.filteredSemesters['Modules'] = this.semesters['Modules'].filter(
          module => module.moduleCode.toLowerCase().includes(filterValue) || module.moduleName.toLowerCase().includes(filterValue)
        );
      } else {
        Object.assign(this.filteredSemesters, this.semesters);
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.routeParameter = params;
    });
    this.progress = true;
    this.getData();
  }

  getData() {
    this.data.getModules().subscribe(
      response => {
        if (this.getRole === 'Student') {
          for (let i = 0; i < 4; i++) {
            const temp = response.modules.filter(module => module.semester === i + 1);
            for (const module of temp) {
              module.teachers = response.teachers.filter(teacher => teacher.moduleCode === module.moduleCode);
              module.lectureHours = response.lectureHours.filter(lectureHour => lectureHour.moduleCode === module.moduleCode);
            }
            this.semesters[this.getCurrentLevel(i)] = temp;
          }
        } else {
          const temp = response.modules;
          for (const module of temp) {
            module.teachers = response.teachers.filter(teacher => teacher.moduleCode === module.moduleCode);
            module.lectureHours = response.lectureHours.filter(lectureHour => lectureHour.moduleCode === module.moduleCode);
          }
          this.semesters['Modules'] = temp;
        }
        this.courseName = response.course || '';
        Object.assign(this.filteredSemesters, this.semesters);
      },
      error => {
        this.error = error;
      }
    ).add(
      () => {
        this.progress = false;
        if (!this.error) {
          setTimeout(() => {
            try {
              document.querySelector(`#${this.routeParameter.moduleCode}`).scrollIntoView({behavior: 'smooth'});
              glow(this.elementRef, this.routeParameter.moduleCode, 'rgb(100, 60, 180)');
            } catch (exeption) {
            }
          }, 200);
        }
      }
    );
  }

  openDeleteModuleDialog(module): void {
    const dialogRef = this.dialog.open(DeleteModuleDialogComponent, {
      width: '450px',
      data: module,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.getData();
      }
    });
  }

  getCurrentLevel(val) {
    return 'Level ' + (Math.floor(val / 2) + 1) + ' Semester ' + (val % 2 + 1);
  }

  get getRole() {
    return this.authentication.details.role;
  }

  get daysOfWeek() {
    return DAYS_OF_WEEK;
  }

}
