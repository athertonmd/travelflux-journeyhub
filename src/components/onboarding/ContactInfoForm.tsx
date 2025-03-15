
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MessageSquare, Link, Plus, X, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Contact, ContactMethod } from '@/hooks/useOnboardingForm';

interface ContactInfoFormProps {
  blurb: string;
  contacts: Contact[];
  onUpdate: (key: 'blurb' | 'contacts', value: any) => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ blurb, contacts, onUpdate }) => {
  const updateBlurb = (value: string) => {
    onUpdate('blurb', value);
  };

  const addNewContact = () => {
    const newContact: Contact = {
      id: uuidv4(),
      title: '',
      methods: [],
      details: ''
    };
    onUpdate('contacts', [...contacts, newContact]);
  };

  const removeContact = (contactId: string) => {
    onUpdate('contacts', contacts.filter(contact => contact.id !== contactId));
  };

  const updateContact = (contactId: string, field: keyof Contact, value: any) => {
    onUpdate(
      'contacts',
      contacts.map(contact => {
        if (contact.id === contactId) {
          return { ...contact, [field]: value };
        }
        return contact;
      })
    );
  };

  const addContactMethod = (contactId: string) => {
    const newMethod: ContactMethod = {
      type: 'telephone',
      value: '',
    };
    
    onUpdate(
      'contacts',
      contacts.map(contact => {
        if (contact.id === contactId) {
          return { ...contact, methods: [...contact.methods, newMethod] };
        }
        return contact;
      })
    );
  };

  const updateContactMethod = (contactId: string, index: number, field: keyof ContactMethod, value: any) => {
    onUpdate(
      'contacts',
      contacts.map(contact => {
        if (contact.id === contactId) {
          const updatedMethods = [...contact.methods];
          updatedMethods[index] = { ...updatedMethods[index], [field]: value };
          return { ...contact, methods: updatedMethods };
        }
        return contact;
      })
    );
  };

  const removeContactMethod = (contactId: string, index: number) => {
    onUpdate(
      'contacts',
      contacts.map(contact => {
        if (contact.id === contactId) {
          const updatedMethods = contact.methods.filter((_, i) => i !== index);
          return { ...contact, methods: updatedMethods };
        }
        return contact;
      })
    );
  };

  const getMethodIcon = (type: ContactMethod['type']) => {
    switch (type) {
      case 'telephone':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'web':
        return <Link className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="contact-blurb">Contact Introduction</Label>
          <Textarea
            id="contact-blurb"
            value={blurb}
            onChange={(e) => updateBlurb(e.target.value)}
            placeholder="Enter a brief message about your contact information"
            className="mt-1"
          />
        </div>
      </div>

      {contacts.length === 0 && (
        <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
          <h3 className="font-medium text-gray-700">No contacts added yet</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Add your first contact method to help travelers get in touch.</p>
          <Button onClick={addNewContact} variant="outline" className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      )}

      {contacts.map((contact) => (
        <div key={contact.id} className="p-5 border border-border rounded-lg bg-gray-50">
          <div className="space-y-4">
            <div>
              <Label htmlFor={`contact-title-${contact.id}`}>Title</Label>
              <Input
                id={`contact-title-${contact.id}`}
                value={contact.title}
                onChange={(e) => updateContact(contact.id, 'title', e.target.value)}
                placeholder="e.g., Main Office, Support Team, etc."
                className="mt-1"
              />
            </div>

            <div className="space-y-2">
              <Label>Contact Methods</Label>
              
              {contact.methods.length === 0 ? (
                <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-sm text-gray-500">No contact methods added yet</p>
                </div>
              ) : (
                contact.methods.map((method, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-grow">
                        <div className="flex gap-2 mb-2">
                          <Input
                            value={method.value}
                            onChange={(e) => updateContactMethod(contact.id, index, 'value', e.target.value)}
                            placeholder={`Enter ${method.type} details`}
                            className="flex-grow"
                          />
                          <Select
                            value={method.type}
                            onValueChange={(value) => updateContactMethod(
                              contact.id, 
                              index, 
                              'type', 
                              value as ContactMethod['type']
                            )}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="telephone">
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-2" />
                                  <span>Telephone</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="email">
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-2" />
                                  <span>Email</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="sms">
                                <div className="flex items-center">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  <span>SMS</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="web">
                                <div className="flex items-center">
                                  <Link className="h-4 w-4 mr-2" />
                                  <span>Web</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {method.type === 'web' && (
                          <Input
                            value={method.linkUrl || ''}
                            onChange={(e) => updateContactMethod(contact.id, index, 'linkUrl', e.target.value)}
                            placeholder="https://example.com"
                            className="mt-2"
                          />
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeContactMethod(contact.id, index)}
                        className="mt-1"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
              
              <Button 
                onClick={() => addContactMethod(contact.id)} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add another contact method
              </Button>
            </div>

            <div>
              <Label htmlFor={`contact-details-${contact.id}`}>Details</Label>
              <Textarea
                id={`contact-details-${contact.id}`}
                value={contact.details}
                onChange={(e) => updateContact(contact.id, 'details', e.target.value)}
                placeholder="e.g., Office hours, availability, etc."
                className="mt-1"
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeContact(contact.id)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove this contact
              </Button>
            </div>
          </div>
        </div>
      ))}

      {contacts.length > 0 && (
        <Button onClick={addNewContact} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add another contact
        </Button>
      )}
    </div>
  );
};

export default ContactInfoForm;
