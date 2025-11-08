import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Inhibitor } from 'src/app/modules/classes/Inhibitor';
import { InhibitorService } from 'src/app/modules/servicios/core/inhibitor.service';

@Component({
  selector: 'app-inhibidora',
  templateUrl: './inhibidora.component.html',
  styleUrls: ['./inhibidora.component.css']
})
export class InhibidoraComponent implements OnInit {

  show = false;
  private subscription: Subscription;

  constructor(private loaderService: InhibitorService) { }

  ngOnInit(): void {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: Inhibitor) => {
        this.show = state.show;
      });
  }

  OnDestroy() {
    this.subscription.unsubscribe();
  }

}
