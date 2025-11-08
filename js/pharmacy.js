const pharmacy = {
    async searchPrescriptions() {
        const patientId = document.getElementById('searchPatientId').value.trim();
        if (!patientId) {
            alert('Please enter a Patient ID');
            return;
        }

        const result = await auth.apiRequest(`/pharmacy/${patientId}`);
        const container = document.getElementById('prescriptionsContainer');
        
        if (result.success && result.data.length > 0) {
            container.innerHTML = result.data.map(prescription => `
                <div class="prescription-card mb-3">
                    <div class="prescription-header">
                        <h5>Prescription</h5>
                        <small class="text-muted">Date: ${new Date(prescription.date).toLocaleDateString()}</small>
                    </div>
                    <div class="mt-3">
                        <strong>Medicines:</strong>
                        ${prescription.medicinesWithStatus.map(med => `
                            <div class="medicine-item">
                                <div>
                                    <strong>${med.name}</strong>
                                    <span class="badge ${med.status === 'issued' ? 'badge-issued' : 'badge-pending'} ms-2">
                                        ${med.status}
                                    </span>
                                </div>
                                <div>
                                    <button 
                                        class="btn btn-sm ${med.status === 'issued' ? 'btn-warning' : 'btn-success'}"
                                        onclick="pharmacy.updateMedicineStatus('${prescription.patientId}', '${prescription.id}', ${med.medicineIndex}, '${med.name}', '${med.status === 'issued' ? 'pending' : 'issued'}')"
                                    >
                                        Mark as ${med.status === 'issued' ? 'Pending' : 'Issued'}
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <p class="text-center text-muted">${result.error || 'No prescriptions found for this patient'}</p>
                    </div>
                </div>
            `;
        }
    },

    async updateMedicineStatus(patientId, prescriptionId, medicineIndex, medicineName, newStatus) {
        const result = await auth.apiRequest('/pharmacy/update', {
            method: 'PUT',
            body: {
                patientId,
                prescriptionId,
                medicineIndex,
                medicineName,
                status: newStatus
            }
        });

        if (result.success) {
            alert('Medicine status updated successfully!');
            this.searchPrescriptions(); // Reload prescriptions
        } else {
            alert(result.error || 'Failed to update medicine status');
        }
    }
};

