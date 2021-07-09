<template>
  <div v-if="isSubmitting" class="overlay" />
  <p v-if="isSuccess" class="success-message">Клиент успешно создан</p>
  <form @submit.prevent="handleSubmit">
    <h1>Регистрация</h1>

    <p class="required-text">* - Поле обязательное для заполнения.</p>

    <Input
      id="last-name"
      :ref="setItemRef"
      :type="InputType.text"
      :required="true"
      label="Фамилия"
    />

    <Input
      id="first-name"
      :ref="setItemRef"
      :type="InputType.text"
      :required="true"
      label="Имя"
    />
    <Input
      id="middle-name"
      :ref="setItemRef"
      :type="InputType.text"
      label="Отчество"
    />

    <Input
      id="birth-date"
      :ref="setItemRef"
      :type="InputType.date"
      :required="true"
      label="Дата рождения"
    />

    <Input
      id="phone-number"
      :ref="setItemRef"
      :type="InputType.tel"
      :required="true"
      label="Номер телефона"
      :maxlength="11"
      :minlength="11"
      :pattern="{
        errMsg: 'Номер телефона должен начинатся с 7',
        regex: /^[7]/,
      }"
    />

    <Input
      id="gender"
      :ref="setItemRef"
      :type="InputType.text"
      :required="false"
      label="Пол"
    />

    <Select
      id="client-group"
      :ref="setItemRef"
      :required="true"
      label="Группа клиентов"
      :multi="true"
      :options="[
        { text: 'VIP', isSelected: false },
        { text: 'Проблемные', isSelected: false },
        { text: 'ОМС', isSelected: false },
      ]"
    />

    <Select
      id="doctor"
      :ref="setItemRef"
      label="Лечащий врач"
      :options="[
        { text: 'Иванов', isSelected: false },
        { text: 'Захаров', isSelected: false },
        { text: 'Чернышева', isSelected: false },
      ]"
    />

    <Input
      id="dont-send-sms"
      :ref="setItemRef"
      :type="InputType.checkbox"
      label="Не отправлять СМС"
    />

    <fieldset>
      <legend>Адрес:</legend>

      <Input
        id="index"
        :ref="setItemRef"
        :type="InputType.number"
        label="Индекс"
      />

      <Input
        id="country"
        :ref="setItemRef"
        :type="InputType.text"
        label="Страна"
      />

      <Input
        id="region"
        :ref="setItemRef"
        :type="InputType.text"
        label="Область"
      />

      <Input
        id="city"
        :ref="setItemRef"
        :type="InputType.text"
        :required="true"
        label="Город"
      />

      <Input
        id="street"
        :ref="setItemRef"
        :type="InputType.text"
        label="Улица"
      />

      <Input id="house" :ref="setItemRef" :type="InputType.text" label="Дом" />
    </fieldset>

    <fieldset>
      <legend>Паспорт:</legend>

      <Select
        id="document-type"
        :ref="setItemRef"
        :required="true"
        label="Тип документа"
        :options="[
          { text: 'Паспорт', isSelected: false },
          { text: 'Свидетельство о рождении', isSelected: false },
          { text: 'Вод. удостоверение', isSelected: false },
        ]"
      />

      <Input
        id="series"
        :ref="setItemRef"
        :type="InputType.text"
        label="Серия"
      />

      <Input
        id="number"
        :ref="setItemRef"
        :type="InputType.number"
        label="Номер"
      />

      <Input
        id="issued-by"
        :ref="setItemRef"
        :type="InputType.text"
        label="Кем выдан"
      />

      <Input
        id="date-of-issue"
        :ref="setItemRef"
        :type="InputType.date"
        label="Дата выдачи"
        :required="true"
      />
    </fieldset>

    <button type="submit">Регистрация</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, onBeforeUpdate, ref } from 'vue'
import Input, { InputType } from '@/components/Input.vue'
import Select from '@/components/Select.vue'
import useVuelidate from '@vuelidate/core'

export default defineComponent({
  name: 'App',
  components: {
    Input,
    Select,
  },
  setup() {
    const isSubmitting = ref(false)
    const isSuccess = ref(false)

    const v$ = useVuelidate()

    let itemRefs: { invalid: boolean; focus: () => void }[] = []

    const setItemRef = (el: { invalid: boolean; focus: () => void }) => {
      if (el) {
        itemRefs.push(el)
      }
    }

    onBeforeUpdate(() => {
      itemRefs = []
    })

    const handleSubmit = () => {
      v$.value.$touch()

      if (v$.value.$invalid) {
        itemRefs.find((el) => el.invalid)?.focus()
      } else {
        isSubmitting.value = true

        setTimeout(() => {
          isSubmitting.value = false
          isSuccess.value = true

          setTimeout(() => {
            isSuccess.value = false
          }, 1000)
        }, Math.random() * 2000 + 400)
      }
    }

    return {
      InputType,
      v$,
      handleSubmit,
      setItemRef,
      isSubmitting,
      isSuccess,
    }
  },
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

body {
  background: #eeeeee;
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}

.overlay,
.success-message {
  position: fixed;
  z-index: 2;
}

.overlay {
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;

  &:after {
    content: '';
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;
  }
}

.success-message {
  box-shadow: 0 0 20px #c5c5c5;
  color: #fff;
  padding: 20px;
  font-size: 20px;
  margin: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #4fc08d;
  border-radius: 5px;
}

form {
  max-width: 600px;
  padding: 70px;
  background: #fff;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 400px) {
    & {
      padding: 20px;
    }
  }
}

h1 {
  font-size: 40px;
  text-align: center;
}

.required-text,
.error {
  color: rgb(255, 0, 64);
  font-style: italic;
  font-size: 15px;
}

.required-text {
  margin: 10px 0;
}

.error-list {
  list-style: none;
  margin: 0;
  padding: 0;

  &__item {
    display: block;
    margin: 5px 0 0;
  }
}

fieldset {
  padding: 10px 70px;
  border: none;
  border-top: 1px solid;
  border-bottom: 1px solid;
  display: flex;
  flex-direction: column;
  margin: 0 -70px 15px;
}

legend {
  font-size: 22px;
  font-weight: 700;
  width: auto;
  margin-left: auto;
  margin-right: auto;
}

label {
  font-size: 18px;
  margin-top: 15px;
  width: 100%;
}

.form-control {
  padding: 7px;
  border: 1px solid #697077;
  border-radius: 5px;
  font-size: 20px;
  width: 100%;
  margin-top: 5px;

  &[type='checkbox'] {
    width: auto;
    margin-left: 7px;
    margin-top: 0;
  }

  &:focus {
    outline: 2px solid #e3edfd;
  }
}

button {
  border: none;
  border-radius: 5px;
  background: #4fc08d;
  font-size: 20px;
  padding: 10px;
  color: #fff;
  text-transform: uppercase;
}
</style>
