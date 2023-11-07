import { Action, createReducer, on } from '@ngrx/store';
import { deleteAssignedEmployee, editEmployeeProjectTime, setClient, setEmployeeProjectTime, setProjectSkills, setReviewedProject, setTempEmployee, setUser,  unSetClient,  unSetEmployeeProjectTime,  unSetProjectSkills,  unSetReviewedProject,  unSetTempEmployee, unSetUser } from './auth.actions';
import { User } from './protected/models/user.models';

type ProjectTime = {
  _id: string,
  name: string,
  hourly_rate: number,
  time: number,
  availability: true
};


export interface Auth {
    user: User | null; 
    tempEmployee: any | null; 
    client: any | null; 
    projectSkills: any [] ,
    reviewedProjects: any [] ,
    projectTime: ProjectTime[];
}

export const initialState: Auth = {
     user: null,
     tempEmployee: null,
     client: null,
     projectSkills:  [],
     projectTime: [],
     reviewedProjects: []
}

const _authReducer = createReducer(initialState,

    on( setUser, (state, { user }) => ({ ...state, user: { ...user }  })),
    on( unSetUser, state => ({ ...state, user: null  })),

    on( setTempEmployee, (state, { employee }) => ({ ...state, tempEmployee: { ...employee }  })),
    on( unSetTempEmployee, state => ({ ...state, tempEmployee: null  })),

    on( setClient, (state, { client }) => ({ ...state, client: { ...client }  })),
    on( unSetClient, state => ({ ...state, client: null  })),

    on( setProjectSkills, (state, { projectSkills }) => ({ ...state, projectSkills: [ ...projectSkills ]  })),
    on( unSetProjectSkills, state => ({ ...state, projectSkills: []  })),

    on( setReviewedProject, (state, { reviewedProjects }) => ({ ...state, reviewedProjects: [ ...reviewedProjects ]  })),
    on( unSetReviewedProject, state => ({ ...state, reviewedProjects: []  })),

    on(setEmployeeProjectTime, (state, { projectTime }) => { return {
          ...state,
          projectTime: [...state.projectTime, ...projectTime],
        };
      }),
    on( unSetEmployeeProjectTime, state => ({ ...state, projectTime: []  })),  


    on(editEmployeeProjectTime, (state, { updatedProjectTime }) => {
      const updatedTime = updatedProjectTime.time;
      const updatedId = updatedProjectTime._id;
    
      const updatedProjectTimeArray = state.projectTime.map(employee => {
        if (employee._id === updatedId) {
          // Si es el elemento que deseas actualizar, crea una copia con la propiedad 'time' actualizada
          return { ...employee, time: updatedTime };
        }
        // Si no es el elemento que deseas actualizar, devuelve el empleado sin cambios
        return employee;
      });
    
      return { ...state, projectTime: updatedProjectTimeArray };
    }),
    
    on(deleteAssignedEmployee, (state, { id }) => {
    
      const updatedProjectTimeArray = state.projectTime.filter(employee => employee._id !== id);
  
      return { ...state, projectTime: updatedProjectTimeArray };
    })
    
);

export function authReducer(state: Auth | undefined, action: Action) {
    return _authReducer(state, action);
}