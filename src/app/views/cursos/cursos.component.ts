import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../providers/firebase';
import { ModalDialogService } from 'ngx-modal-dialog';

@Component({
  templateUrl: 'cursos.component.html'
})
export class CursosComponent implements OnInit {

  cursos;
  curso = {
    name: '',
    description: '',
    id: 0,
    enable: true,
    createdAt: new Date()
  };
  showMessage = false;
  message = 'Usuario';
  loading = true;
  editCurso = false;
  trashItem;

  constructor(
    private firebaseService: FirebaseService,
    public modalService: ModalDialogService, public viewRef: ViewContainerRef,
    private router: Router,
  ) {
    this.firebaseService.getCursos()
      .then((res) => {
        this.cursos = res;
        this.loading = false;
      })
  }

  cancel() {
    this.editCurso = !this.editCurso;

    // //Clear
    // this.curso.name = '';
    // this.curso.description = '';
  }

  trilhas(c) {
    localStorage.setItem('trilhas', c.courseId);
    this.router.navigate(['trilhas'])
  }


  newCourse() {
    this.curso.createdAt = new Date();
    this.curso.id = this.cursos.length + 1;

    if (
      (this.curso.name != '') &&
      (this.curso.description != '')
    ) {
      this.loading = true
      this.firebaseService.newCourse(this.curso).then(() => {
        this.firebaseService.getCursos()
          .then((res) => {
            this.cursos = res;
            this.loading = false;

            this.curso.name = '';
            this.curso.description = '';
          })
      })

    }
  }


  save() {
    this.loading = true;
    this.firebaseService.updateCourse(this.curso)
      .then(() => {

        this.firebaseService.getCursos()
          .then((res) => {
            this.cursos = res;
            this.loading = false;
          })
      })
  }


  edit(c) {
    //Clear
    this.curso.name = '';
    this.curso.description = '';

    window.scrollTo(0, 0)
    this.editCurso = true;
    this.curso = c;
  }

  trash(user) {
    this.trashItem = user
    this.modalService.openDialog(this.viewRef, {
      title: 'Confirmar ação',
      actionButtons: [
        { text: 'Cancelar' },
        {
          text: 'Confimar exclusão', onAction: () => {
            this.firebaseService.removeCourse(this.trashItem)
              .then(() => {
                console.log('ação concluída com sucesso');
                location.reload()
              })
          }
        }
      ],

    });
  }


  // createUser() {
  //   this.loading = true;
  //   this.newUser.createdAt = new Date();
  //   this.newUser.fullName = this.newUser.firstName + " " + this.newUser.lastName;
  //   this.firebaseService.create(this.newUser)
  //     .then(() => {
  //       this.firebaseService.getUsers()
  //         .then((res) => {
  //           this.usuarios = res;
  //           this.loading = false;
  //         })

  //       //Clear
  //       this.newUser.email = '';
  //       this.newUser.firstName = '';
  //       this.newUser.fullName = '';
  //       this.newUser.lastName = '';
  //       this.newUser.cpf = '';
  //     })
  //     .catch((err) => {
  //       this.loading = false;
  //       this.showMessage = true;
  //       this.message = 'Usuário já cadastrado';

  //       setTimeout(() => {
  //         this.showMessage = false;
  //       }, 2000)
  //     })
  // }

  ngOnInit() {

  }
}
