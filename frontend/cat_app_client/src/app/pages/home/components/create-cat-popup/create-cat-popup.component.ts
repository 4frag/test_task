import { Component } from '@angular/core';
import { CatsService } from '../../../../services/cats.service';
import { FormControl, FormGroup } from '@angular/forms';
import { PopupService } from '../../../../services/popup.service';
import { ICatPopupContext } from '../../../../data/catPopupContext';

@Component({
  selector: 'app-create-cat-popup',
  templateUrl: './create-cat-popup.component.html',
  styleUrl: './create-cat-popup.component.css'
})
export class CreateCatPopupComponent {
  context: ICatPopupContext;
  createCatForm = new FormGroup({
    name: new FormControl(''),
    birth_date: new FormControl(''),
    breed: new FormControl(''),
    hairiness: new FormControl(1),
  })

  constructor (private catsService: CatsService, public popupService: PopupService) {
    popupService.data.subscribe({
      next: (data) => {
        this.context = data;
        if (this.context.edit) {
          catsService.getCatInfo(this.context.catId).subscribe({
            next: cat => {
              this.createCatForm.setValue({
                name: cat.name,
                birth_date: cat.birth_date,
                breed: cat.breed,
                hairiness: cat.hairiness
              })
            }
          })
        }
      }
    })
  }

  handleClick() {
    let new_cat = Object(this.createCatForm.value)
    let stream;

    for (let key of Object.keys(new_cat)) {
      if (!new_cat[key]) {
        new_cat[key] = null
      }
    }

    if (this.context.edit) {
      if (this.context.catId) {
        stream = this.catsService.put(new_cat, this.context.catId)
      } else {
        alert('Не удалось получить CatId')
      }
    } else {
      stream = this.catsService.create(new_cat)
    }

    stream?.subscribe({
      next: () => this.updateCats()
    })
  }

  deleteCat() {
    this.context.catId ? this.catsService.delete(this.context.catId).subscribe({
      next: () => this.updateCats()
    }) : null
  }

  close() {
    this.popupService.clear()
  }

  updateCats() {
    this.catsService.getAll()?.subscribe()
    this.close()
  }
}
