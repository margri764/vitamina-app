import { Action, createReducer, on } from '@ngrx/store';
import { editEmployeeProjectTime, setEmployeeProjectTime, setProjectSkills, setTempEmployee, setUser,  unSetEmployeeProjectTime,  unSetProjectSkills,  unSetTempEmployee, unSetUser } from './auth.actions';
import { User } from './protected/models/user.models';

type ProjectTime = {
  id: string,
  name: string,
  hourly_rate: number
  time: number;
};


export interface Auth {
    user: User | null; 
    tempEmployee: any | null; 
    projectSkills: any [] ,
    projectTime: ProjectTime[];
}

export const initialState: Auth = {
     user: null,
     tempEmployee: null,
     projectSkills:  [],
     projectTime: [],
}

const _authReducer = createReducer(initialState,

    on( setUser, (state, { user }) => ({ ...state, user: { ...user }  })),
    on( unSetUser, state => ({ ...state, user: null  })),

    on( setTempEmployee, (state, { employee }) => ({ ...state, tempEmployee: { ...employee }  })),
    on( unSetTempEmployee, state => ({ ...state, tempEmployee: null  })),

    on( setProjectSkills, (state, { projectSkills }) => ({ ...state, projectSkills: [ ...projectSkills ]  })),
    on( unSetProjectSkills, state => ({ ...state, projectSkills: []  })),

    on(setEmployeeProjectTime, (state, { projectTime }) => { return {
          ...state,
          projectTime: [...state.projectTime, ...projectTime],
        };
      }),
    on( unSetEmployeeProjectTime, state => ({ ...state, projectTime: []  })),  


    on(editEmployeeProjectTime, (state, { updatedProjectTime }) => {
      
      const index = state.projectTime.findIndex(employee => employee.id === updatedProjectTime.id);
    
      if (index === -1) {
        return state;
      }
    
      const newState = { ...state };
    
      const editedEmployee = { ...state.projectTime[index], time: updatedProjectTime.time };
    
      newState.projectTime[index] = editedEmployee;
    
      return newState;
    })
    
);

export function authReducer(state: Auth | undefined, action: Action) {
    return _authReducer(state, action);
}