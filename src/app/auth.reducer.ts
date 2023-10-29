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
      const updatedTime = updatedProjectTime.time;
      const updatedId = updatedProjectTime.id;
    
      const updatedProjectTimeArray = state.projectTime.map(employee => {
        if (employee.id === updatedId) {
          // Si es el elemento que deseas actualizar, crea una copia con la propiedad 'time' actualizada
          return { ...employee, time: updatedTime };
        }
        // Si no es el elemento que deseas actualizar, devuelve el empleado sin cambios
        return employee;
      });
    
      return { ...state, projectTime: updatedProjectTimeArray };
    })
    
    
);

export function authReducer(state: Auth | undefined, action: Action) {
    return _authReducer(state, action);
}