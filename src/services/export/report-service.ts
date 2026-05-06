import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Match, ActionType } from '../../types';

export const reportService = {
  async generateTacticalReport(match: Match, heatmapElementId: string) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const primaryColor = '#FF6B00';
    const bgColor = '#0A0A0A';
    const textColor = '#FFFFFF';

    // Set dark background
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 297, 'F');

    // Header section
    doc.setTextColor(primaryColor);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('KABADDI INTEL PRO', 20, 30);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text('TACTICAL RECONNAISSANCE REPORT', 20, 38);
    doc.text(`TIMESTAMP: ${new Date().toLocaleString()}`, 140, 38);

    // Divider
    doc.setDrawColor(40, 40, 40);
    doc.line(20, 45, 190, 45);

    // Match Identity
    doc.setTextColor(textColor);
    doc.setFontSize(16);
    doc.text(`${match.homeTeam.name} VS ${match.awayTeam.name}`, 20, 60);
    
    doc.setTextColor(primaryColor);
    doc.setFontSize(28);
    doc.text(`${match.score.home} - ${match.score.away}`, 20, 75);

    // Tactical Intelligence
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text('KEY TELEMETRY', 20, 90);
    
    doc.setTextColor(textColor);
    doc.setFontSize(12);
    const raidCount = match.actions?.filter(a => a.type === ActionType.RAID).length || 0;
    const tackleCount = match.actions?.filter(a => a.type === ActionType.TACKLE).length || 0;
    doc.text(`Total Raids: ${raidCount}`, 20, 100);
    doc.text(`Total Tackles: ${tackleCount}`, 70, 100);
    doc.text(`Active Momentum: ${match.momentum || 0}%`, 130, 100);

    // Spatial Matrix (Heatmap) Capture
    try {
      const element = document.getElementById(heatmapElementId);
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: '#0F0F0F',
          scale: 2,
          logging: false
        });
        const imgData = canvas.toDataURL('image/png');
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(10);
        doc.text('SPATIAL INTENSITY MATRIX', 20, 115);
        doc.addImage(imgData, 'PNG', 20, 120, 170, 70);
      }
    } catch (err) {
      console.error('Heatmap capture failed', err);
    }

    // Personnel Performance
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text('PRIMARY PERSONNEL READINESS', 20, 205);

    let yOffset = 215;
    match.homeTeam.players.slice(0, 5).forEach((player, i) => {
      doc.setTextColor(textColor);
      doc.setFontSize(11);
      doc.text(`#${player.number} ${player.name}`, 20, yOffset);
      doc.setTextColor(primaryColor);
      doc.text(`${player.stats.efficiency}%`, 100, yOffset);
      doc.setTextColor(100, 100, 100);
      doc.text(player.role, 140, yOffset);
      
      // Mini indicator line
      doc.setDrawColor(30, 30, 30);
      doc.line(20, yOffset + 3, 190, yOffset + 3);
      yOffset += 10;
    });

    // Footer Branding
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(8);
    doc.text('CONFIDENTIAL INTEL - PROPRIETARY TACTICAL ENGINE', 20, 285);
    doc.text('GENERATED VIA GEMINI 2.0 FLASH AI', 140, 285);

    // Download the file
    doc.save(`Tactical_Report_${match.homeTeam.shortName}_VS_${match.awayTeam.shortName}.pdf`);
  }
};
