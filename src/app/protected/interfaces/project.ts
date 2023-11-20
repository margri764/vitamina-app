

export interface Project {
    client: string;
    employee: string[];
    project_scope: {
      name: string;
      description: string;
      main_features: string[];
      estimatedDeliveryTime?: string[];
    };
    relatedSkills: string[],
    duration: {
      employee: string;
      assigned_hours: number;
    }[];
    other_details?: string;
    project?: string

}