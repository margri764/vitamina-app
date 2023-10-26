import { createAction, props } from "@ngrx/store";

/************************** SET *******************************/
export const setUser = createAction( '[Auth] setUser',
    props<{ user: any }>()
);

export const setTempEmployee = createAction( '[Auth] setTempEmployee',
    props<{ employee: any }>()
);





/************************** UNSET *******************************/
export const unSetUser = createAction('[Auth] unSetUser');
export const unSetTempEmployee = createAction('[Auth] unSetTempEmployee');