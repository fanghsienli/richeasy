import { Injectable } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

import { tap, filter, map, mergeMap } from "rxjs/operators";

import { createEffect } from "@ngrx/effects";

@Injectable()
export class RouterEffects {
    updateTitle$ = createEffect(
        () =>
            this.router.events.pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => {
                    let route = this.activatedRoute;
                    while (route.firstChild) route = route.firstChild;
                    console.log(route.data);// - ${data['title']} //本來在22行
                    return route;
                }),
                mergeMap(route => route.data),
                map(data => `RichEasy`),
                tap(title => this.titleService.setTitle(title))
            ),
        {
            dispatch: false,
        }
    );

    constructor(
        private router: Router,
        private titleService: Title,
        private activatedRoute: ActivatedRoute
    ) { }
}
