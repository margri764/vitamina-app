import { createAction, props } from "@ngrx/store";

type ProjectTime = {
    _id: string,
    name: string,
    hourly_rate: number
    time: number;
    availability: true
  };
  

/************************** SET *******************************/
export const setUser = createAction( '[Auth] setUser',
    props<{ user: any }>()
);

export const setTempEmployee = createAction( '[Auth] setTempEmployee',
    props<{ employee: any }>()
);

export const setClient = createAction( '[Auth] setClient',
    props<{ client: any }>()
);

export const setProjectSkills = createAction( '[Auth] setProjectSkills',
    props<{ projectSkills: any [] }>()
);

export const setRevProjectSkills = createAction( '[Auth] setRevProjectSkills',
    props<{ revProjectSkills: any [] }>()
);

export const setReviewedProject = createAction( '[Auth] setReviewedProject',
    props<{ reviewedProjects: any [] }>()
);

export const setEmployeeProjectTime = createAction( '[Auth] setEmployeeProjectTime',
    props<{ projectTime: ProjectTime [] }>()
);

export const editEmployeeProjectTime = createAction( '[Auth] EditEmployeeProjectTime',
    props<{ updatedProjectTime: ProjectTime }>()
  );

  export const deleteAssignedEmployee = createAction( '[Auth] deleteAssignedEmployee',
    props<{ id: string }>()
  );






/************************** UNSET *******************************/
export const unSetUser = createAction('[Auth] unSetUser');
export const unSetTempEmployee = createAction('[Auth] unSetTempEmployee');
export const unSetProjectSkills = createAction('[Auth] unSetProjectSkills');
export const unSetRevProjectSkills = createAction('[Auth] unSetRevProjectSkills');
export const unSetEmployeeProjectTime = createAction( '[Auth] unSetEmployeeProjectTime');
export const unSetClient = createAction( '[Auth] unSetClient');
export const unSetReviewedProject = createAction( '[Auth] unSetReviewedProject');