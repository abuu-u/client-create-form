<template>
  <label ref="labelRef" :for="id" @keydown.esc="isOpen = false">
    <span> {{ label }}: <sup v-if="required">*</sup> </span>

    <select
      :id="id"
      ref="selectRef"
      v-model="select"
      :aria-describedby="`${id}-errors`"
      class="visually-hidden"
      :multiple="multi"
    >
      <option v-if="!multi" value="">Выбрать</option>
      <option v-for="value in values" :key="value.text" :value="value.text">
        {{ value.text }}
      </option>
    </select>

    <div
      key="select"
      role="listbox"
      tabindex="0"
      class="form-control select"
      :class="{ 'select--open': isOpen }"
      @click="handleSelectClick"
      @blur="v$.select.$touch"
    >
      <p class="currentOption">{{ selectText ? selectText : 'Выбрать' }}</p>

      <ul class="options" role="presentation">
        <li
          v-for="(value, i) in values"
          :key="value.text"
          role="option"
          :aria-selected="value.isSelected"
          class="options__item"
          :class="{ 'options__item--current': value.isSelected }"
          @click="handeOptionClick(value, i)"
        >
          {{ value.text }}
        </li>
      </ul>
    </div>
  </label>

  <ul
    v-if="v$.select.$error"
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
import { ref } from '@vue/reactivity'
import useVuelidate, { ValidationArgs } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { computed, defineComponent, PropType, watch } from 'vue'
import { requiredIf } from '@vuelidate/validators'

interface Option {
  text: string
  isSelected: boolean
}

export default defineComponent({
  name: 'Select',

  props: {
    id: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    multi: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array as PropType<Option[]>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props) {
    const isOpen = ref(false)
    const values = ref<Option[]>(props.options)
    const select = ref<string[] | string>(props.multi ? [] : '')
    const selectRef = ref<HTMLSelectElement>()
    const labelRef = ref<HTMLElement>()

    const selectText = computed<string>(() =>
      values.value
        .filter((value) => value.isSelected)
        .map((value) => value.text)
        .join(', '),
    )

    const rules = computed<ValidationArgs>(() => ({
      select: {
        requiredIf: helpers.withMessage(
          '* - Поле обязательное для заполнения.',
          requiredIf(props.required),
        ),
      },
    }))

    const v$ = useVuelidate(rules, { select })

    const invalid = computed(() => v$.value.$error ?? false)

    watch(select, (value) => {
      if (props.multi) {
        values.value.forEach(
          (option) =>
            (option.isSelected = (value as Array<string>).some(
              (text) => text === option.text,
            )),
        )
      } else {
        values.value.forEach(
          (option) => (option.isSelected = value === option.text),
        )
      }
    })

    const handleSelectClick = (evt: Event) => {
      if (
        !isOpen.value ||
        !props.multi ||
        (props.multi && (evt.target as HTMLElement).tagName !== 'LI')
      ) {
        isOpen.value = !isOpen.value
      }
    }

    const handeOptionClick = (option: Option, i: number) => {
      const selectOption = selectRef.value?.options

      if (selectOption) {
        selectOption[props.multi ? i : i + 1].selected = !option.isSelected
      }

      selectRef.value?.dispatchEvent(new Event('change'))
    }

    const focus = () => {
      selectRef.value?.focus()
      labelRef.value?.scrollIntoView()
    }

    return {
      handleSelectClick,
      isOpen,
      handeOptionClick,
      v$,
      select,
      values,
      selectText,
      selectRef,
      labelRef,
      focus,
      invalid,
    }
  },
})
</script>

<style lang="scss">
.select {
  position: relative;
  cursor: pointer;
  display: flex;

  &:after {
    right: 7px;
    content: '▼';
    position: absolute;
    z-index: 1;
    transition: transform 0.2s;
  }

  &--open:after {
    transform: rotate(180deg);
  }
}

.currentOption {
  height: 23px;
  margin: 0 20px 0 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.options {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.45);
  position: absolute;
  top: 100%;
  left: 0;
  margin: 10px 0 0 0;
  padding: 0;
  list-style: none;
  z-index: 2;
  background: #fff;
  cursor: pointer;
  width: 100%;
  border: 1px solid #697077;
  border-radius: 5px;
  transform: scaleY(0);
  transform-origin: top;
  overflow: hidden;
  transition: transform 0.2s;

  .select--open & {
    transform: scaleY(1);
  }
}

.options__item {
  padding: 7px;

  &:hover:not(&--current) {
    background: rgb(248, 248, 248);
  }

  &--current {
    background: #eee;
  }
}
</style>
