const doctor = {
    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.getElementById('createPatientForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPatient();
        });

        document.getElementById('assignLabTestForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.assignLabTest();
        });

        document.getElementById('createPrescriptionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPrescription();
        });
    },

    async searchPatient() {
        const patientId = document.getElementById('searchPatientId').value.trim();
        if (!patientId) {
            alert('Please enter a Patient ID');
            return;
        }

        const result = await auth.apiRequest(`/patients/by-id/${patientId}`);
        const container = document.getElementById('patientSearchResult');
        
        if (result.success) {
            const patient = result.data;
            container.innerHTML = `
                <div class="patient-card">
                    <h5>${patient.name}</h5>
                    <p><strong>Patient ID:</strong> ${patient.patientId}</p>
                    <p><strong>Age:</strong> ${patient.age} years</p>
                    <p><strong>Gender:</strong> ${patient.gender}</p>
                    <p><strong>Contact:</strong> ${patient.contact}</p>
                </div>
            `;
            await this.loadPatientReports(patientId);
        } else {
            container.innerHTML = `<div class="alert alert-danger">${result.error || 'Patient not found'}</div>`;
        }
    },

    async loadPatientReports(patientId) {
        const result = await auth.apiRequest(`/lab/reports/${patientId}`);
        const container = document.getElementById('patientReportsContainer');
        
        if (result.success && result.data.length > 0) {
            container.innerHTML = `
                <h6 class="mt-3">Reports:</h6>
                ${result.data.map(report => `
                    <div class="report-item">
                        <h6>${report.testName}</h6>
                        <p class="mb-1"><strong>Uploaded:</strong> ${new Date(report.uploadDate).toLocaleString()}</p>
                        <a href="${report.fileUrl}" target="_blank" class="btn btn-sm btn-primary">View Report</a>
                    </div>
                `).join('')}
            `;
        } else {
            container.innerHTML = '<p class="text-muted mt-3">No reports found for this patient</p>';
        }
    },

    async createPatient() {
        // Get form values
        const name = document.getElementById('patientName').value.trim();
        const age = document.getElementById('patientAge').value.trim();
        const gender = document.getElementById('patientGender').value.trim();
        const contact = document.getElementById('patientContact').value.trim();
        const birthYear = document.getElementById('patientBirthYear').value.trim();
        const email = document.getElementById('patientEmail').value.trim();
        const password = document.getElementById('patientPassword').value;
        
        // Validate required fields
        if (!name || !age || !gender || !contact || !birthYear || !email || !password) {
            const alertContainer = document.getElementById('createPatientAlert');
            alertContainer.innerHTML = `
                <div class="alert alert-danger">
                    Please fill in all required fields including email and password.
                </div>
            `;
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const alertContainer = document.getElementById('createPatientAlert');
            alertContainer.innerHTML = `
                <div class="alert alert-danger">
                    Please enter a valid email address.
                </div>
            `;
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            const alertContainer = document.getElementById('createPatientAlert');
            alertContainer.innerHTML = `
                <div class="alert alert-danger">
                    Password must be at least 6 characters long.
                </div>
            `;
            return;
        }
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('age', age);
        formData.append('gender', gender);
        formData.append('contact', contact);
        formData.append('birthYear', birthYear);
        formData.append('email', email);
        formData.append('password', password);
        
        const photoFile = document.getElementById('patientPhoto').files[0];
        if (photoFile) {
            formData.append('photo', photoFile);
        }

        const token = auth.getToken();
        const API_BASE_URL = window.API_BASE_URL || 'http://localhost:5000/api';
        
        // Show loading state
        const alertContainer = document.getElementById('createPatientAlert');
        alertContainer.innerHTML = `
            <div class="alert alert-info">
                Creating patient... Please wait.
            </div>
        `;
        
        const result = await fetch(`${API_BASE_URL}/patients/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await result.json();
        
        if (result.ok) {
            alertContainer.innerHTML = `
                <div class="alert alert-success">
                    <strong>Patient created successfully!</strong><br>
                    Patient ID: <strong>${data.patient.patientId}</strong><br>
                    Email: <strong>${data.patient.email}</strong><br>
                    <small class="text-muted">Please share the login credentials with the patient securely.</small>
                </div>
            `;
            document.getElementById('createPatientForm').reset();
        } else {
            let errorMessage = data.error || 'Failed to create patient';
            if (data.details) {
                errorMessage += `<br><small>Details: ${data.details}</small>`;
            }
            if (data.hint) {
                errorMessage += `<br><small class="text-warning">💡 ${data.hint}</small>`;
            }
            alertContainer.innerHTML = `
                <div class="alert alert-danger">${errorMessage}</div>
            `;
            console.error('Create patient error:', data);
        }
    },

    async assignLabTest() {
        const patientId = document.getElementById('labTestPatientId').value.trim();
        const testName = document.getElementById('labTestName').value.trim();

        const result = await auth.apiRequest('/doctor/assign-lab-test', {
            method: 'POST',
            body: { patientId, testName }
        });

        const alertContainer = document.getElementById('assignLabTestAlert');
        
        if (result.success) {
            alertContainer.innerHTML = `
                <div class="alert alert-success">Lab test assigned successfully!</div>
            `;
            document.getElementById('assignLabTestForm').reset();
        } else {
            alertContainer.innerHTML = `
                <div class="alert alert-danger">${result.error || 'Failed to assign lab test'}</div>
            `;
        }
    },

    async createPrescription() {
        const patientId = document.getElementById('prescriptionPatientId').value.trim();
        const medicinesText = document.getElementById('prescriptionMedicines').value.trim();
        
        // Parse medicines (support both newline and comma separation)
        const medicines = medicinesText.split(/[,\n]/)
            .map(m => m.trim())
            .filter(m => m.length > 0);

        const result = await auth.apiRequest('/prescriptions/', {
            method: 'POST',
            body: { patientId, medicines }
        });

        const alertContainer = document.getElementById('createPrescriptionAlert');
        
        if (result.success) {
            alertContainer.innerHTML = `
                <div class="alert alert-success">Prescription created successfully!</div>
            `;
            document.getElementById('createPrescriptionForm').reset();
        } else {
            alertContainer.innerHTML = `
                <div class="alert alert-danger">${result.error || 'Failed to create prescription'}</div>
            `;
        }
    }
};

