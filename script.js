// ──────────────────────────────────────────────
//  Máscaras automáticas
// ──────────────────────────────────────────────

const cepInput = document.getElementById('cep');
const ufInput  = document.getElementById('uf');
const form     = document.getElementById('addressForm');

// Máscara CEP: 00000-000
cepInput.addEventListener('input', () => {
  let v = cepInput.value.replace(/\D/g, '').slice(0, 8);
  if (v.length > 5) {
    v = v.replace(/^(\d{5})(\d{1,3})$/, '$1-$2');
  }
  cepInput.value = v;
  clearError('cep');
});

// UF → maiúsculo automático
ufInput.addEventListener('input', () => {
  ufInput.value = ufInput.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
  clearError('uf');
});

// Número → só dígitos
document.getElementById('numero').addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '');
  clearError('numero');
});

// Limpa erro ao digitar nos outros campos
['logradouro', 'complemento'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearError(id));
});

// ──────────────────────────────────────────────
//  Validação e envio
// ──────────────────────────────────────────────

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const cep        = cepInput.value.trim();
  const logradouro = document.getElementById('logradouro').value.trim();
  const numero     = document.getElementById('numero').value.trim();
  const uf         = ufInput.value.trim();

  const regexCEP = /^(\d{5})-(\d{3})$/;
  const regexUF  = /^[A-Z]{2}$/;

  let erros = [];

  // CEP
  if (!cep) {
    erros.push({ field: 'cep', msg: 'O campo CEP é obrigatório.' });
  } else if (!regexCEP.test(cep)) {
    erros.push({ field: 'cep', msg: 'CEP inválido. Use o formato 00000-000.' });
  }

  // Logradouro
  if (!logradouro) {
    erros.push({ field: 'logradouro', msg: 'O campo Logradouro é obrigatório.' });
  } else if (logradouro.length < 5) {
    erros.push({ field: 'logradouro', msg: 'Logradouro deve ter no mínimo 5 caracteres.' });
  }

  // Número
  if (!numero) {
    erros.push({ field: 'numero', msg: 'O campo Número é obrigatório.' });
  } else if (!/^\d+$/.test(numero)) {
    erros.push({ field: 'numero', msg: 'Número deve conter apenas dígitos.' });
  }

  // UF
  if (!uf) {
    erros.push({ field: 'uf', msg: 'O campo UF é obrigatório.' });
  } else if (!regexUF.test(uf)) {
    erros.push({ field: 'uf', msg: 'UF inválida. Use 2 letras maiúsculas (ex: SP, RJ).' });
  }

  if (erros.length > 0) {
    // Exibe o primeiro alerta e marca os campos com erro
    erros.forEach(({ field, msg }) => setError(field, msg));
    alert(erros.map(e => e.msg).join('\n'));
    return;
  }

  // Sucesso
  showSuccess();
  alert('Endereço cadastrado com sucesso');
});

// ──────────────────────────────────────────────
//  Helpers de UI
// ──────────────────────────────────────────────

function setError(fieldId, msg) {
  const wrap = document.getElementById(fieldId)?.closest('.field-wrap');
  if (!wrap) return;
  wrap.classList.add('error');
  const hint = wrap.querySelector('.hint');
  if (hint) hint.textContent = msg;
}

function clearError(fieldId) {
  const wrap = document.getElementById(fieldId)?.closest('.field-wrap');
  if (!wrap) return;
  wrap.classList.remove('error');
  const hint = wrap.querySelector('.hint');
  if (hint) hint.textContent = wrap.dataset.hint || '';
}

function showSuccess() {
  const card = document.getElementById('addressForm').closest('.card');
  card.classList.add('success-flash');
  setTimeout(() => card.classList.remove('success-flash'), 800);
}
