/**
 * As of now used the Mock data for medicines, symptoms check, first aid and emergency
 * Later Load all these data at runtime from S3 from data partners
 */

module.exports = {
    /* Sample Possible symptoms*/
    possibleSymptoms: {
        "fever": ['cold and cough', 'vomiting sensation', 'very tired'],
        'cold': ['heavy cough', 'moderate cough', 'throat pain'],
        'stomachPain': ['vomiting', 'loose motion', 'digestion problem'],
        'headAche': ['cold', 'pain in forehead', 'one sided headache']
    }
};
