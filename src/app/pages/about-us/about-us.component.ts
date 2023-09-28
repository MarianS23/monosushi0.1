import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {


  faqs = [
    { 
      question: 'How can I order if our address is not included in your delivery zone?', answer: 'If your address is outside our delivery area, you can pick up your order by pickup at one of our addresses. (In this case, you will receive Baked Mono Maki with Salmon as a gift). Or you can ask the operator if it is possible to make an exception for delivery outside the zone at a given time.', expanded: false },
    { question: 'How long does it take to receive an order?', answer: 'Delivery time depends on the order address. Delivery to the green zone - up to 1 hour. Delivery to the yellow zone - up to 1.5 hours.', expanded: false },
    { question: 'Is the delivery free?', answer: 'Yes, delivery is free with a minimum order amount of UAH 200 in the green delivery zone and UAH 300 in the yellow zone.', expanded: false },
    { question: 'What time do you accept orders?', answer: 'We accept orders every day from 11:00 to 21:30 (due to the curfew)', expanded: false },
  ];

  openIndex: number = -1;

  toggleAccordion(index: number): void {
    if (this.openIndex === index) {
      this.openIndex = -1;
    } else {
      this.openIndex = index;
    }

    this.faqs.forEach((faq, i) => {
      faq.expanded = i === this.openIndex;
    });

    const accordionContent = document.querySelector('.accordion-content.active');

    if (accordionContent) {
      accordionContent.classList.remove('transition');
      setTimeout(() => {
        accordionContent.classList.add('transition');
      }, 10);
    }
  }

  
}

