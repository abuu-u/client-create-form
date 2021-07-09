<template>
  <label ref="labelRef" :for="id">
    <span>
      {{ label }}<span v-if="showColon">:</span>
      <sup v-if="required"> *</sup>
    </span>

    <input
      :id="id"
      ref="inputRef"
      v-model="value"
      class="form-control"
      :type="type"
      :name="id"
      :aria-describedby="`${id}-errors`"
      @blur="v$.value.$touch"
    />
  </label>

  <ul
    v-if="v$.value.$error"
    :id="`${id}-errors`"
    aria-live="assertive"
    class="error-list"
  >
    <li
      v-for="error in v$.$errors"
      :key="error.$message"
      class="error-list__item error"
    >
      {{ error.$message }}
    </li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import useVuelidate, { ValidationArgs } from '@vuelidate/core'
import {
  minLength,
  maxLength,
  requiredIf,
  helpers,
} from '@vuelidate/validators'

export enum InputType {
  text = 'text',
  tel = 'tel',
  number = 'number',
  date = 'date',
  checkbox = 'checkbox',
}

export default defineComponent({
  name: 'Input',
  props: {
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<InputType>,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: Number,
      default: null,
    },
    minlength: {
      type: Number,
      default: null,
    },
    pattern: {
      type: Object as PropType<{
        errMsg: string
        regex: RegExp
      }>,
      default: null,
    },
  },
  setup(props) {
    const showColon = computed<boolean>(() => props.type !== InputType.checkbox)

    const value = ref('')

    const inputRef = ref<HTMLInputElement>()
    const labelRef = ref<HTMLInputElement>()

    const emptyRule = {
      $message: '',
      $validator: () => true,
    }

    const rules = computed<ValidationArgs>(() => ({
      value: {
        requiredIf: helpers.withMessage(
          '* - Поле обязательное для заполнения.',
          requiredIf(props.required),
        ),
        minLength: props.minlength
          ? helpers.withMessage(
              ({ $params }: { $params: { min: number } }) =>
                `${props.label} должен состоять минимум из ${$params.min} цифр`,
              minLength(props.minlength),
            )
          : emptyRule,
        maxLength: props.maxlength
          ? helpers.withMessage(
              ({ $params }: { $params: { max: number } }) =>
                `${props.label} должен состоять максимум из ${$params.max} цифр`,
              maxLength(props.maxlength),
            )
          : emptyRule,
        pattern: props.pattern
          ? helpers.withMessage(
              props.pattern.errMsg,
              helpers.regex(props.pattern.regex),
            )
          : emptyRule,
      },
    }))

    const v$ = useVuelidate(rules, { value })

    const invalid = computed(() => v$.value.$error ?? false)

    const focus = () => {
      inputRef.value?.focus()
      labelRef.value?.scrollIntoView()
    }

    return {
      showColon,
      value,
      v$,
      invalid,
      focus,
      inputRef,
      labelRef,
    }
  },
})
</script>

<style lang="scss"></style>
