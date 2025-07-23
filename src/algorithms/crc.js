import { XOR, CRC_POLYNOMIALS } from "../utils/utils.js";

export class CRC {
    
    /*
        @param:
            frame list: Lista de bits del frame
            polynomial list: Lista de bits del polinomio generador
        @return:
            frame_bits dict: lista de residuo ademas de los pasos de la division
    */
    getResidue(frame, polynomial) {
        let frame_bits = [];
        let division_steps = [];
        let flag_star_steps = false;

        for (let i = 0; i < frame.length; i++) {
            
            frame_bits.push(frame[i]); 
            
            if(frame_bits.length === polynomial.length) {
                
                let residue = [];
                for(let j = 0; j < polynomial.length; j++) {
                    residue.push(XOR(frame_bits[j], polynomial[j]));
                }
                
                // Guardar resultados intermedios
                division_steps.push({
                    dividendo: [...frame_bits],
                    divisor: [...polynomial],
                    cociente: '1',
                    residuo: [...residue]
                });
         
                // Elimnar ceros a la izquierda
                while(residue.length > 0 && residue[0] === '0') {
                    residue.shift();
                };

                frame_bits = residue;

                // Por primera vez se ha realizado una division
                flag_star_steps = true;
            }

            else if(flag_star_steps && frame_bits.length < polynomial.length) {
                // Guardar resultados intermedios
                division_steps.push({
                    dividendo: [...Array.from({length: polynomial.length - frame_bits.length}, () => '0'), ...frame_bits],
                    divisor: Array.from({length: polynomial.length}, () => '0'),
                    cociente: '0',
                    residuo: [...Array.from({length: polynomial.length - frame_bits.length}, () => '0'), ...frame_bits]
                });
            }

            // Si aún no hemos empezado la división, eliminamos ceros iniciales
            if (!flag_star_steps) {
                while (frame_bits.length > 0 && frame_bits[0] === '0') {
                    frame_bits.shift();
                }
            }

        }

        return {residue: frame_bits, division_steps: division_steps};

    }
    
    /*
        @param:
            frame list: Lista de bits del frame
            polynomial list: Lista de bits del polinomio generador
        @return:
            frame_bits string: Trama de transmision con el CRC agregado al final
    */
    buidFrameTransmission(frame, polynomial) { 
        let frame_with_zeros = frame.slice();

        // Agregar ceros al final del frame
        for(let i = 0; i < polynomial.length - 1; i++) {
            frame_with_zeros.push('0'); 
        }
        
        return frame.join('') + this.getResidue(frame_with_zeros, polynomial).residue.join('');
    }

    /*
        @param:
            frame string: frame
        @return:
            polynomial string: Polinomio generador que se utiliza para calcular el CRC
    */
    getCRCPolynomial(frame) {        
        for (const[length, polynomial] of Object.entries(CRC_POLYNOMIALS)) {
            if (frame.length > length) {
                const frame_transmited = this.buidFrameTransmission(frame.split(''), polynomial.split(''));
                const quotient = this.getResidue(frame_transmited.split(''), polynomial.split('')).residue.join('');

                if (parseInt(quotient, 10) === 0) {
                    return polynomial;
                }
            }
        }
        
        return null;
        
    }

}
