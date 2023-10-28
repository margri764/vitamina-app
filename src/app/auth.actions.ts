import { createAction, props } from "@ngrx/store";

type ProjectTime = {
    id: string,
    name: string,
    hourly_rate: number
    time: number;
  };
  

/************************** SET *******************************/
export const setUser = createAction( '[Auth] setUser',
    props<{ user: any }>()
);

export const setTempEmployee = createAction( '[Auth] setTempEmployee',
    props<{ employee: any }>()
);

export const setProjectSkills = createAction( '[Auth] setProjectSkills',
    props<{ projectSkills: any [] }>()
);

export const setEmployeeProjectTime = createAction( '[Auth] setEmployeeProjectTime',
    props<{ projectTime: ProjectTime [] }>()
);






/************************** UNSET *******************************/
export const unSetUser = createAction('[Auth] unSetUser');
export const unSetTempEmployee = createAction('[Auth] unSetTempEmployee');
export const unSetProjectSkills = createAction('[Auth] unSetProjectSkills');
export const unSetEmployeeProjectTime = createAction( '[Auth] unSetEmployeeProjectTime');