export interface ParameterSet {
    parameters: { [key: string]: any };  
    add(key: string, value: any): ParameterSet; 
    getIntValue(key: string): number;   
    getDoubleValue(key: string): number;
    toMap(): { [key: string]: any };            
  }
