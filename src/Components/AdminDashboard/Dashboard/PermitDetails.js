import React, { useState, useEffect } from 'react';
import { Modal, Button, Dropdown, Menu } from 'antd';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import * as XLSX from 'xlsx';
import './PermitDetails.css';
import ProcessFlow from './ProcessFlow';

function PermitDetails({ visible, onClose, permit, adminPlan }) {
  const [isModalVisible, setIsModalVisible] = useState(visible);

  useEffect(() => {
    setIsModalVisible(visible);
  }, [visible]);

  if (!permit) {
    return <p></p>;
  }

  // Ensure all necessary properties are initialized
  const {
    ptwNumber = 'Not Filled',
    contractorName = 'Not Filled',
    projectName = 'Not Filled',
    numberOfEmployees = 'Not Filled',
    startDate = 'Not Filled',
    completionDate = 'Not Filled',
    liftingEquipment = 'Not Filled',
    weight = 'Not Filled',
    dimension = 'Not Filled',
    quantity = 'Not Filled',
    serialNumber = 'Not Filled',
    inspectionDate = 'Not Filled',
    capacity = 'Not Filled',
    currentLocation = 'Not Filled',
    jobDescription = 'Not Filled',
    electricalRisks = [],
    precautions = {},
    inspectedItems = [],
    otherInspectionItem = 'Not Filled',
    ppeItems = [],
    otherPPEItem = 'Not Filled',
    receiverName = 'Not Filled',
    receiverSignature = 'Not Filled',
    acceptanceDate = 'Not Filled',
    plantLocation = 'Not Filled'
  } = permit;

  const currentStage = permit.status || 'Initiated';

  const handleCancel = () => {
    setIsModalVisible(false);
    onClose();
  };

  const handleDownload = async (format) => {
    try {
      console.log(`Attempting to download as ${format}`);
      
      switch (format) {
        case 'pdf':
          const pdfDoc = new jsPDF();
          pdfDoc.text('Permit Details', 10, 10);
          pdfDoc.text(`Permit Number: ${ptwNumber}`, 10, 20);
          pdfDoc.text(`Contractor Name: ${contractorName}`, 10, 30);
          pdfDoc.text(`Project Name: ${projectName}`, 10, 40);
          pdfDoc.text(`Number of Employees: ${numberOfEmployees}`, 10, 50);
          pdfDoc.text(`Start Date: ${startDate}`, 10, 60);
          pdfDoc.text(`Completion Date: ${completionDate}`, 10, 70);
          pdfDoc.text(`Lifting Equipment: ${liftingEquipment}`, 10, 80);
          pdfDoc.text(`Weight: ${weight}`, 10, 90);
          pdfDoc.text(`Dimension: ${dimension}`, 10, 100);
          pdfDoc.text(`Quantity: ${quantity}`, 10, 110);
          pdfDoc.text(`Serial Number: ${serialNumber}`, 10, 120);
          pdfDoc.text(`Inspection Date: ${inspectionDate}`, 10, 130);
          pdfDoc.text(`Capacity: ${capacity}`, 10, 140);
          pdfDoc.text(`Current Location: ${currentLocation}`, 10, 150);
          pdfDoc.text(`Job Description: ${jobDescription}`, 10, 160);
          pdfDoc.text(`Electrical Risks: ${electricalRisks.length > 0 ? electricalRisks.join(', ') : 'Not Filled'}`, 10, 170);
          pdfDoc.text(`Precautions: ${Object.entries(precautions).map(([key, value]) => `${key}: ${value}`).join(', ') || 'Not Filled'}`, 10, 180);
          pdfDoc.text(`Inspected Items: ${inspectedItems.length > 0 ? inspectedItems.join(', ') : 'Not Filled'}`, 10, 190);
          pdfDoc.text(`Other Inspection Item: ${otherInspectionItem}`, 10, 200);
          pdfDoc.text(`PPE Items: ${ppeItems.length > 0 ? ppeItems.join(', ') : 'Not Filled'}`, 10, 210);
          pdfDoc.text(`Other PPE Item: ${otherPPEItem}`, 10, 220);
          pdfDoc.text(`Receiver Name: ${receiverName}`, 10, 230);
          pdfDoc.text(`Receiver Signature: ${receiverSignature}`, 10, 240);
          pdfDoc.text(`Acceptance Date: ${acceptanceDate}`, 10, 250);
          pdfDoc.text(`Plant Location: ${plantLocation}`, 10, 260);
          pdfDoc.save('permit-details.pdf');
          break;

        case 'word':
          const wordDoc = new Document({
            sections: [
              {
                properties: {},
                children: [
                  new Paragraph({
                    text: 'Permit Details',
                    heading: HeadingLevel.HEADING_1,
                  }),
                  ...Object.entries({
                    'Permit Number': ptwNumber,
                    'Contractor Name': contractorName,
                    'Project Name': projectName,
                    'Number of Employees': numberOfEmployees,
                    'Start Date': startDate,
                    'Completion Date': completionDate,
                    'Lifting Equipment': liftingEquipment,
                    'Weight': weight,
                    'Dimension': dimension,
                    'Quantity': quantity,
                    'Serial Number': serialNumber,
                    'Inspection Date': inspectionDate,
                    'Capacity': capacity,
                    'Current Location': currentLocation,
                    'Job Description': jobDescription,
                    'Electrical Risks': electricalRisks.length > 0 ? electricalRisks.join(', ') : 'Not Filled',
                    'Precautions': Object.entries(precautions).map(([key, value]) => `${key}: ${value}`).join(', ') || 'Not Filled',
                    'Inspected Items': inspectedItems.length > 0 ? inspectedItems.join(', ') : 'Not Filled',
                    'Other Inspection Item': otherInspectionItem,
                    'PPE Items': ppeItems.length > 0 ? ppeItems.join(', ') : 'Not Filled',
                    'Other PPE Item': otherPPEItem,
                    'Receiver Name': receiverName,
                    'Receiver Signature': receiverSignature,
                    'Acceptance Date': acceptanceDate,
                    'Plant Location': plantLocation,
                  }).map(([label, value]) => new Paragraph(`${label}: ${value}`))
                ],
              },
            ],
          });

          try {
            const blob = await Packer.toBlob(wordDoc);
            saveAs(blob, 'permit-details.docx');
          } catch (error) {
            console.error("Error generating Word document:", error);
          }
          break;

        case 'excel':
          const excelData = [
            ['Field', 'Value'],
            ['Permit Number', ptwNumber],
            ['Contractor Name', contractorName],
            ['Project Name', projectName],
            ['Number of Employees', numberOfEmployees],
            ['Start Date', startDate],
            ['Completion Date', completionDate],
            ['Lifting Equipment', liftingEquipment],
            ['Weight', weight],
            ['Dimension', dimension],
            ['Quantity', quantity],
            ['Serial Number', serialNumber],
            ['Inspection Date', inspectionDate],
            ['Capacity', capacity],
            ['Current Location', currentLocation],
            ['Job Description', jobDescription],
            ['Electrical Risks', electricalRisks.length > 0 ? electricalRisks.join(', ') : 'Not Filled'],
            ['Precautions', Object.entries(precautions).map(([key, value]) => `${key}: ${value}`).join(', ') || 'Not Filled'],
            ['Inspected Items', inspectedItems.length > 0 ? inspectedItems.join(', ') : 'Not Filled'],
            ['Other Inspection Item', otherInspectionItem],
            ['PPE Items', ppeItems.length > 0 ? ppeItems.join(', ') : 'Not Filled'],
            ['Other PPE Item', otherPPEItem],
            ['Receiver Name', receiverName],
            ['Receiver Signature', receiverSignature],
            ['Acceptance Date', acceptanceDate],
            ['Plant Location', plantLocation],
          ];

          const ws = XLSX.utils.aoa_to_sheet(excelData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Permit Details');
          XLSX.writeFile(wb, 'permit-details.xlsx');
          break;

        default:
          console.warn("Unsupported format");
          break;
      }
    } catch (error) {
      console.error("Error handling download:", error);
    }
  };

  const menu = (
    <Menu>
    {console.log(`Admin plan in menu: ${adminPlan}`)} {/* Debugging */}
    {adminPlan === 'Premium' || adminPlan === 'Enterprise' ? (
      <>
        <Menu.Item onClick={() => handleDownload('pdf')}>Download as PDF</Menu.Item>
        <Menu.Item onClick={() => handleDownload('word')}>Download as Word</Menu.Item>
        <Menu.Item onClick={() => handleDownload('excel')}>Download as Excel</Menu.Item>
      </>
    ) : (
      <Menu.Item disabled>Download options are not available with the Free plan.</Menu.Item>
    )}
  </Menu>
  );

  const tableData = [
    { key: 'ptwNumber', label: 'Permit Number', value: ptwNumber },
    { key: 'contractorName', label: 'Contractor Name', value: contractorName },
    { key: 'projectName', label: 'Project Name', value: projectName },
    { key: 'numberOfEmployees', label: 'Number of Employees', value: numberOfEmployees },
    { key: 'startDate', label: 'Start Date', value: startDate },
    { key: 'completionDate', label: 'Completion Date', value: completionDate },
    { key: 'liftingEquipment', label: 'Lifting Equipment', value: liftingEquipment },
    { key: 'weight', label: 'Weight', value: weight },
    { key: 'dimension', label: 'Dimension', value: dimension },
    { key: 'quantity', label: 'Quantity', value: quantity },
    { key: 'serialNumber', label: 'Serial Number', value: serialNumber },
    { key: 'inspectionDate', label: 'Inspection Date', value: inspectionDate },
    { key: 'capacity', label: 'Capacity', value: capacity },
    { key: 'currentLocation', label: 'Current Location', value: currentLocation },
    { key: 'jobDescription', label: 'Job Description', value: jobDescription },
    { key: 'electricalRisks', label: 'Electrical Risks', value: electricalRisks.length > 0 ? electricalRisks.join(', ') : 'Not Filled' },
    { key: 'precautions', label: 'Precautions', value: Object.entries(precautions).map(([key, value]) => `${key}: ${value}`).join(', ') || 'Not Filled' },
    { key: 'inspectedItems', label: 'Inspected Items', value: inspectedItems.length > 0 ? inspectedItems.join(', ') : 'Not Filled' },
    { key: 'otherInspectionItem', label: 'Other Inspection Item', value: otherInspectionItem },
    { key: 'ppeItems', label: 'PPE Items', value: ppeItems.length > 0 ? ppeItems.join(', ') : 'Not Filled' },
    { key: 'otherPPEItem', label: 'Other PPE Item', value: otherPPEItem },
    { key: 'receiverName', label: 'Receiver Name', value: receiverName },
    { key: 'receiverSignature', label: 'Receiver Signature', value: receiverSignature },
    { key: 'acceptanceDate', label: 'Acceptance Date', value: acceptanceDate },
    { key: 'plantLocation', label: 'Plant Location', value: plantLocation }
  ];

  return (
    <Modal
      title="Permit Details"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <Dropdown overlay={menu} key="download-menu">
          <Button>
            Download <span>▼</span>
          </Button>
        </Dropdown>
      ]}
    >
      <div className="permit-details">
        <ProcessFlow currentStage={currentStage} />
        <table className="permit-details-table">
          <tbody>
            {tableData.map(({ key, label, value }) => (
              <tr key={key}>
                <td className="label">{label}</td>
                <td className="value">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

export default PermitDetails;
