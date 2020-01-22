import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {PdfViewerComponent} from 'ng2-pdf-viewer';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-guide-dialog',
  templateUrl: './guide-dialog.component.html',
  styleUrls: ['./guide-dialog.component.scss']
})
export class GuideDialogComponent implements OnInit {
  pdfSrc;
  @ViewChild(PdfViewerComponent, {static: true}) private pdfComponent: PdfViewerComponent;

  constructor(public dialogRef: MatDialogRef<GuideDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
    this.pdfSrc = '/assets/media/guide.pdf';
  }

  closeGuide() {
    this.dialogRef.close();
  }
}
