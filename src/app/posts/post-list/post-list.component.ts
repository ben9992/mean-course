import { Component, OnInit, Input} from '@angular/core';
import { Post } from '../post.model';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() posts: Post[] = []
    // {title: 'first Post', content: 'fasdfasdf'},
    // {title: 'second Post', content: 'fasdfasdf'},
    // {title: 'third Post', content: 'fasdfasdf'}

}
