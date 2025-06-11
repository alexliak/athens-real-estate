'use client';

import { useState } from 'react';
import AddressAutocomplete from './AddressAutocomplete';

interface PropertyFormData {
  title: string;
  type: 'sale' | 'rent';
  propertyType: string;
  price: number;
  address: string;
  coordinates?: { lat: number; lng: number };
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  floor: string;
  yearBuilt: number;
  description: string;
  features: string[];
}

export default function PropertyAddForm() {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    type: 'sale',
    propertyType: 'Διαμέρισμα',
    price: 0,
    address: '',
    sqm: 0,
    bedrooms: 1,
    bathrooms: 1,
    floor: '1ος',
    yearBuilt: new Date().getFullYear(),
    description: '',
    features: []
  });

  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const handleAddressSelect = (address: any) => {
    setSelectedAddress(address);
    setFormData({
      ...formData,
      address: `${address.street_name} ${address.street_number}, ${address.municipality}`,
      coordinates: { lat: address.lat, lng: address.lng }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAddress) {
      alert('Παρακαλώ επιλέξτε μια έγκυρη διεύθυνση από τη λίστα');
      return;
    }

    // Εδώ θα στέλναμε τα δεδομένα στο backend
    console.log('Submitting property:', {
      ...formData,
      location: {
        street: selectedAddress.street_name,
        streetNumber: selectedAddress.street_number,
        area: selectedAddress.municipality,
        lat: selectedAddress.lat,
        lng: selectedAddress.lng,
        fullAddress: selectedAddress.full_address
      }
    });

    alert('Το ακίνητο καταχωρήθηκε επιτυχώς!');
  };

  const propertyTypes = ['Διαμέρισμα', 'Μεζονέτα', 'Μονοκατοικία', 'Studio', 'Loft'];
  const floors = ['Υπόγειο', 'Ισόγειο', '1ος', '2ος', '3ος', '4ος', '5ος', '6ος', 'Ρετιρέ'];
  const allFeatures = [
    'Ασανσέρ', 'Μπαλκόνι', 'Αποθήκη', 'Θέση parking', 'Αυτόνομη θέρμανση',
    'Κλιματισμός', 'Ηλιακός θερμοσίφωνας', 'Τζάκι', 'Συναγερμός', 'Κήπος',
    'Βεράντα', 'Πόρτα ασφαλείας', 'Διπλά τζάμια', 'Ανακαινισμένο'
  ];

  return (
    <div className="container my-5">
      <h2 className="mb-4">Προσθήκη Νέου Ακινήτου</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Βασικά Στοιχεία */}
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Βασικά Στοιχεία</h5>
                
                <div className="mb-3">
                  <label className="form-label">Τίτλος Αγγελίας *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="π.χ. Ευρύχωρο διαμέρισμα στο Κολωνάκι"
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Τύπος Αγγελίας *</label>
                    <select
                      className="form-select"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sale' | 'rent' })}
                    >
                      <option value="sale">Πώληση</option>
                      <option value="rent">Ενοικίαση</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Τύπος Ακινήτου *</label>
                    <select
                      className="form-select"
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    >
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Τιμή (€) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                    placeholder={formData.type === 'rent' ? 'Μηνιαίο ενοίκιο' : 'Τιμή πώλησης'}
                  />
                </div>
              </div>
            </div>

            {/* Διεύθυνση */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Διεύθυνση</h5>
                
                <div className="mb-3">
                  <label className="form-label">Διεύθυνση Ακινήτου *</label>
                  <AddressAutocomplete onSelect={handleAddressSelect} />
                  <small className="text-muted">
                    Πληκτρολογήστε την οδό και επιλέξτε από τη λίστα
                  </small>
                </div>

                {selectedAddress && (
                  <div className="alert alert-success">
                    <strong>Επιλεγμένη διεύθυνση:</strong><br />
                    {selectedAddress.street_name} {selectedAddress.street_number}, {selectedAddress.municipality}
                    <br />
                    <small className="text-muted">
                      Συντεταγμένες: {selectedAddress.lat.toFixed(6)}, {selectedAddress.lng.toFixed(6)}
                    </small>
                  </div>
                )}
              </div>
            </div>

            {/* Χαρακτηριστικά */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Χαρακτηριστικά</h5>
                
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Τετραγωνικά (τ.μ.) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.sqm}
                      onChange={(e) => setFormData({ ...formData, sqm: parseInt(e.target.value) || 0 })}
                      required
                      min="0"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Υπνοδωμάτια *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                      required
                      min="0"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Μπάνια *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Όροφος</label>
                    <select
                      className="form-select"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    >
                      {floors.map(floor => (
                        <option key={floor} value={floor}>{floor}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Έτος Κατασκευής</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.yearBuilt}
                      onChange={(e) => setFormData({ ...formData, yearBuilt: parseInt(e.target.value) || 0 })}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Παροχές</label>
                  <div className="row">
                    {allFeatures.map(feature => (
                      <div key={feature} className="col-md-4 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={feature}
                            checked={formData.features.includes(feature)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ 
                                  ...formData, 
                                  features: [...formData.features, feature] 
                                });
                              } else {
                                setFormData({ 
                                  ...formData, 
                                  features: formData.features.filter(f => f !== feature) 
                                });
                              }
                            }}
                          />
                          <label className="form-check-label" htmlFor={feature}>
                            {feature}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Περιγραφή */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Περιγραφή</h5>
                <textarea
                  className="form-control"
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Προσθέστε μια αναλυτική περιγραφή του ακινήτου..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="col-md-4">
            <div className="card sticky-top" style={{ top: '20px' }}>
              <div className="card-body">
                <h5 className="card-title">Προεπισκόπηση</h5>
                
                <div className="mb-3">
                  <strong>{formData.title || 'Τίτλος αγγελίας'}</strong>
                </div>
                
                <div className="mb-2">
                  <span className="badge bg-primary me-2">
                    {formData.type === 'sale' ? 'Πώληση' : 'Ενοικίαση'}
                  </span>
                  <span className="badge bg-secondary">
                    {formData.propertyType}
                  </span>
                </div>
                
                <h4 className="text-primary mb-3">
                  €{formData.price.toLocaleString('el-GR')}
                  {formData.type === 'rent' && <small>/μήνα</small>}
                </h4>
                
                {selectedAddress && (
                  <p className="mb-2">
                    <i className="bi bi-geo-alt me-2"></i>
                    {selectedAddress.municipality}
                  </p>
                )}
                
                <div className="mb-3">
                  <small className="text-muted">
                    {formData.sqm > 0 && `${formData.sqm}τ.μ. • `}
                    {formData.bedrooms > 0 && `${formData.bedrooms} υπνοδ. • `}
                    {formData.bathrooms > 0 && `${formData.bathrooms} μπάνια`}
                  </small>
                </div>
                
                {formData.features.length > 0 && (
                  <div className="mb-3">
                    <strong>Παροχές:</strong>
                    <div className="mt-2">
                      {formData.features.map(feature => (
                        <span key={feature} className="badge bg-light text-dark me-1 mb-1">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <button type="submit" className="btn btn-primary w-100">
                  <i className="bi bi-check-circle me-2"></i>
                  Καταχώρηση Ακινήτου
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
