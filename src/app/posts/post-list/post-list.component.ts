import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  posts = [
    {title: 'first Post', content: 'fasdfasdf'},
    {title: 'second Post', content: 'fasdfasdf'},
    {title: 'third Post', content: 'fasdfasdf'}
  ]

}
