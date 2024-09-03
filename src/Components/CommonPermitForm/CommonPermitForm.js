import React from 'react';
import { useParams } from 'react-router-dom';
import PermitForm from './PermitForm';
import {
    electricalRiskAssociated,
    liftingRiskAssociated,
    workAtHeightRiskAssociated,
    confinedSpaceRiskAssociated,
    fireRiskAssociated,
    environmentalRiskAssociated,
    hotWorkRiskAssociated,
    coldWorkRiskAssociated,
    excavationRiskAssociated,
    demolitionRiskAssociated,
    chemicalRiskAssociated,
    radiationRiskAssociated,
    permitPrecautions,
    permitHeadings,
    permitFormData,
    inspectionItemsData,
    ppeItems
} from './Data/PermitData';

function CommonPermitForm() {
    const { permitType } = useParams();

    let riskAssociated = [];
    let precautions = [];
    let inspectionItems = [];

    switch (permitType) {
        case 'permitformelectrical':
            riskAssociated = electricalRiskAssociated;
            precautions = permitPrecautions['permitformelectrical'];
            inspectionItems = inspectionItemsData['permitformelectrical'];
            break;
        case 'permitformlifting':
            riskAssociated = liftingRiskAssociated;
            precautions = permitPrecautions['permitformlifting'];
            inspectionItems = inspectionItemsData['permitformlifting'];
            break;
        case 'workAtHeight':
            riskAssociated = workAtHeightRiskAssociated;
            precautions = permitPrecautions['workAtHeight'];
            inspectionItems = inspectionItemsData['workAtHeight'];
            break;
        case 'confinedSpace':
            riskAssociated = confinedSpaceRiskAssociated;
            precautions = permitPrecautions['confinedSpace'];
            inspectionItems = inspectionItemsData['confinedSpace'];
            break;
        case 'fire':
            riskAssociated = fireRiskAssociated;
            precautions = permitPrecautions['fire'];
            inspectionItems = inspectionItemsData['fire'];
            break;
        case 'environmental':
            riskAssociated = environmentalRiskAssociated;
            precautions = permitPrecautions['environmental'];
            inspectionItems = inspectionItemsData['environmental'];
            break;
        case 'hotWork':
            riskAssociated = hotWorkRiskAssociated;
            precautions = permitPrecautions['hotWork'];
            inspectionItems = inspectionItemsData['hotWork'];
            break;
        case 'coldWork':
            riskAssociated = coldWorkRiskAssociated;
            precautions = permitPrecautions['coldWork'];
            inspectionItems = inspectionItemsData['coldWork'];
            break;
        case 'excavation':
            riskAssociated = excavationRiskAssociated;
            precautions = permitPrecautions['excavation'];
            inspectionItems = inspectionItemsData['excavation'];
            break;
        case 'demolition':
            riskAssociated = demolitionRiskAssociated;
            precautions = permitPrecautions['demolition'];
            inspectionItems = inspectionItemsData['demolition'];
            break;
        case 'chemical':
            riskAssociated = chemicalRiskAssociated;
            precautions = permitPrecautions['chemical'];
            inspectionItems = inspectionItemsData['chemical'];
            break;
        case 'radiation':
            riskAssociated = radiationRiskAssociated;
            precautions = permitPrecautions['radiation'];
            inspectionItems = inspectionItemsData['radiation'];
            break;
        default:
            riskAssociated = [];
            precautions = [];
            inspectionItems = [];
    }

    const heading = permitHeadings[permitType] || 'Permit Form';

    return (
        <PermitForm
            riskAssociated={riskAssociated}
            permitFormData={permitFormData}
            precautions={precautions}
            inspectionItems={inspectionItems}
            heading={heading}
            ppeItems={ppeItems}
        />
    );
}

export default CommonPermitForm;
