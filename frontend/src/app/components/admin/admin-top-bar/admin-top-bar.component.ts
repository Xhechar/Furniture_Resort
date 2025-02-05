import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HandlerService } from '../../../services/handler.service';

@Component({
  selector: 'app-admin-top-bar',
  standalone: true,
  imports: [],
  templateUrl: './admin-top-bar.component.html',
  styleUrl: './admin-top-bar.component.css'
})
export class AdminTopBarComponent implements OnInit {
  parent: string = '';
  child: string = '';

  constructor(private router: Router, private hs: HandlerService) {
    let route = router.url;
  }

  ngOnInit(): void {
    this.hs.topBar$.subscribe(res => {
      if (!res) {
        this.parent = 'Dashboard';
        this.child = 'products';
      } else {
        this.parent = res.parent;
        this.child = res.child;
      }
    });
  }
}
