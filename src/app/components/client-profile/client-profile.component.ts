import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { ClientProfile, UpdateClientProfileRequest } from '../../models/client.model';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {
  profileForm!: FormGroup;
  clientProfile?: ClientProfile;
  clientId!: number;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  calculatedImc: number | null = null;
  calculatedImcCategory: string = '';

  // Wizard steps
  currentStep = 1;
  totalSteps = 4;

  niveauActiviteOptions = [
    { value: 'Sédentaire', label: 'Sédentaire' },
    { value: 'Modéré', label: 'Modéré' },
    { value: 'Actif', label: 'Actif' },
    { value: 'Très actif', label: 'Très actif' }
  ];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.clientId = +params['id'];
        console.log('Client ID from route:', this.clientId);
        this.initForm();
        this.loadClientProfile();
      } else {
        this.errorMessage = 'ID du client non trouvé dans l\'URL';
      }
    });
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      age: [null, [Validators.required, Validators.min(1), Validators.max(150)]],
      sexe: ['', Validators.required],
      niveauActivite: [''],
      poids: [null, [Validators.required, Validators.min(1), Validators.max(500)]],
      taille: [null, [Validators.required, Validators.min(1), Validators.max(300)]],
      objectifs: [''],
      allergies: [''],
      maladiesChroniques: ['']
    });

    // Subscribe to weight and height changes to calculate IMC
    this.profileForm.get('poids')?.valueChanges.subscribe(() => {
      this.calculateImc();
    });
    this.profileForm.get('taille')?.valueChanges.subscribe(() => {
      this.calculateImc();
    });
  }

  calculateImc(): void {
    const poids = this.profileForm.get('poids')?.value;
    const taille = this.profileForm.get('taille')?.value;

    if (poids && taille && poids > 0 && taille > 0) {
      const tailleM = taille / 100;
      this.calculatedImc = parseFloat((poids / (tailleM * tailleM)).toFixed(1));
      this.calculatedImcCategory = this.determineImcCategory(this.calculatedImc);
    } else {
      this.calculatedImc = null;
      this.calculatedImcCategory = '';
    }
  }

  determineImcCategory(imc: number): string {
    if (imc < 18.5) return 'Insuffisance pondérale';
    if (imc < 25) return 'Poids normal';
    if (imc < 30) return 'Surpoids';
    if (imc < 35) return 'Obésité modérée';
    if (imc < 40) return 'Obésité sévère';
    return 'Obésité morbide';
  }

  loadClientProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Loading profile for client ID:', this.clientId);

    this.clientService.getClientProfile(this.clientId).subscribe({
      next: (profile) => {
        console.log('Profile loaded successfully:', profile);
        this.clientProfile = profile;

        this.profileForm.patchValue({
          age: profile.age || null,
          sexe: profile.sexe || '',
          poids: profile.poids || null,
          taille: profile.taille || null,
          objectifs: profile.objectifs || '',
          allergies: profile.allergies || '',
          maladiesChroniques: profile.maladiesChroniques || '',
          niveauActivite: profile.niveauActivite || ''
        });

        // Calculate IMC after loading data
        this.calculateImc();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Impossible de charger le profil. Veuillez vérifier l\'ID du client.';
        this.isLoading = false;
      }
    });
  }

  // Check if current step is valid
  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!this.profileForm.get('age')?.valid && !!this.profileForm.get('sexe')?.valid;
      case 2:
        return !!this.profileForm.get('poids')?.valid && !!this.profileForm.get('taille')?.valid;
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  }

  // Navigate between steps
  nextStep(): void {
    if (this.isStepValid(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.errorMessage = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      this.markCurrentStepTouched();
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToStep(step: number): void {
    // Only allow going to completed steps or next step
    if (step <= this.currentStep || this.isStepValid(this.currentStep)) {
      this.currentStep = step;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private markCurrentStepTouched(): void {
    switch(this.currentStep) {
      case 1:
        this.profileForm.get('age')?.markAsTouched();
        this.profileForm.get('sexe')?.markAsTouched();
        break;
      case 2:
        this.profileForm.get('poids')?.markAsTouched();
        this.profileForm.get('taille')?.markAsTouched();
        break;
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const request: UpdateClientProfileRequest = {
        age: this.profileForm.value.age,
        sexe: this.profileForm.value.sexe,
        poids: this.profileForm.value.poids,
        taille: this.profileForm.value.taille,
        objectifs: this.profileForm.value.objectifs || null,
        allergies: this.profileForm.value.allergies || null,
        maladiesChroniques: this.profileForm.value.maladiesChroniques || null,
        niveauActivite: this.profileForm.value.niveauActivite || null
      };

      console.log('Submitting profile update:', request);

      this.clientService.updateClientProfile(this.clientId, request).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.clientProfile = response;
          this.successMessage = 'Profil mis à jour avec succès!';
          this.isLoading = false;

          window.scrollTo({ top: 0, behavior: 'smooth' });

          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (error) => {
          console.error('Error updating profile:', error);

          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 400) {
            this.errorMessage = 'Données invalides. Veuillez vérifier tous les champs obligatoires.';
          } else if (error.status === 404) {
            this.errorMessage = 'Client non trouvé. Veuillez vérifier l\'ID.';
          } else {
            this.errorMessage = 'Erreur lors de la mise à jour du profil. Veuillez réessayer.';
          }

          this.isLoading = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    } else {
      this.markFormGroupTouched(this.profileForm);
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement.';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getImcCategory(): string {
    return this.calculatedImcCategory || this.clientProfile?.categorieImc || 'Non calculé';
  }

  getImcCategoryClass(): string {
    const category = this.getImcCategory();
    if (!category) return '';

    if (category.includes('normal')) return 'text-success';
    if (category.includes('Insuffisance')) return 'text-warning';
    if (category.includes('Surpoids')) return 'text-warning';
    if (category.includes('Obésité')) return 'text-danger';

    return '';
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  getDisplayImc(): number | null {
    return this.calculatedImc || this.clientProfile?.imc || null;
  }
}
